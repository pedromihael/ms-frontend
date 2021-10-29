import React, { useCallback, useEffect, useState } from 'react';
import { useConnection } from '../../hooks/useConnection';
import { useHistory } from 'react-router-dom';
import { Header } from '../../components/Header';
import MaterialTable from 'material-table';

import { Container, Button } from './styles';

const projectsColumns = [
  { title: 'Project', field: 'name' },
  { title: 'Responsible', field: 'responsible' },
  { title: 'Effort (hours)', field: 'hours_effort' },
  { title: 'IT Service Provider', field: 'name' },
  { title: 'Proj. Confidence Level (%)', field: 'reliability_percentage' },
];

const providersColumns = [
  { title: 'Provider', field: 'name' },
  { title: 'Confidence Level (%)', field: 'reliability_percentage' },
];

export const CalculateBugfree = () => {
  const history = useHistory();
  const apiConnection = useConnection();

  const [projectsData, setProjectsData] = useState([]);
  const [providersData, setProvidersData] = useState([]);

  const [projectRel, setProjectRel] = useState(0);
  const [providerRel, setProviderRel] = useState(0);

  const handleRedirect = useCallback((data) => {
    history.push({
      pathname: `/projects/${data.id}/details`,
      state: data,
    });
  }, []);

  const handleRedirectToAdmin = useCallback((data) => {
    history.push({
      pathname: `/admin/projects`,
      state: data,
    });
  }, []);

  const handleProjectsFetch = useCallback(async () => {
    const projectsResult = await apiConnection.get('/projects');


    const projectsAndIncidents = [];
    if (projectsResult.data) {
      const projects = projectsResult.data;

      for await (const project of projects) {
        const {
          fk_provider,
          hours_effort,
          id,
          name,
          reliability_percentage,
          responsible,
          provider_id,
          provider,
          providerReliability,
        } = project;

        const data = {
          fk_provider,
          hours_effort,
          id,
          name,
          reliability_percentage: reliability_percentage || 100,
          responsible,
          tableData: { id },
          provider_id,
          provider,
          providerReliability,
        };

        const providersResult = await apiConnection.get(`/providers/${fk_provider}`);

        if (providersResult.data) {
          const provider = providersResult.data;
          Object.assign(data, { providerReliability: provider.reliability_percentage });
        }

        projectsAndIncidents.push(data);
      }
    }

    setProjectsData(projectsAndIncidents);
  }, []);

  const handleProvidersFetch = useCallback(() => {
    const providersAndProjects = [];

    projectsData.forEach((projectData) => {
      const { provider_id, name, providerReliability } = projectData;
      const projects = projectsData.filter((project) => project.fk_provider === provider_id);
      providersAndProjects.push({
        id: provider_id,
        name: name,
        reliability_percentage: providerReliability || 100,
        projects: projects.length,
      });
    });

    setProvidersData(providersAndProjects);
  }, [projectsData]);

  useEffect(() => {
    (async () => {
      const rels = await apiConnection('/reliabilities');
      if (rels.data) {
        const proj = rels.data.find((rel) => rel.name === 'Project');
        proj && setProjectRel(proj.meta_percent);

        const prov = rels.data.find((rel) => rel.name === 'Provider');
        prov && setProviderRel(prov.meta_percent);

      }
    })();

  }, [projectsData]);

  useEffect(() => {
    (async () => {
      await handleProjectsFetch();
    })();
  }, []);

  useEffect(() => {
    handleProvidersFetch();
  }, [projectsData]);

  return (
    <>
      <Header title='Bugfree Goal by Project' />
      <Container>
        <MaterialTable
          columns={projectsColumns}
          data={projectsData}
          title={`Projects Confidence Level - Global goal: ${projectRel}%`}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit',
              onClick: (event, rowData) => handleRedirectToAdmin({ ...rowData }),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            rowStyle: (evt, rowData) => {
              return {
                backgroundColor: parseFloat(evt.reliability_percentage) < projectRel ? '#FF9999' : '#BDFFA4',
              };
            },
          }}
        />
        <MaterialTable
          columns={providersColumns}
          data={providersData}
          title={`It Service Providers Confidence Level - Global goal: ${providerRel}%`}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit',
              onClick: (event, rowData) => handleRedirect({ ...rowData }),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            rowStyle: (evt, rowData) => ({
              backgroundColor: parseFloat(evt.reliability_percentage) < providerRel ? '#FF9999' : '#BDFFA4',
            }),
          }}
        />
        <Button onClick={() => history.push('/')}>Back to home</Button>
      </Container>
    </>
  );
};
