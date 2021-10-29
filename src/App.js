import React from 'react';
import Home from './pages/home';
import IncidentIdentification from './pages/incident-identification';
import SeverityRegistration from './pages/severity';
import RegisterProject from './pages/register-project';
import RegisterProvider from './pages/register-provider';
import ConfidenceLevel from './pages/confidence-level';
import GlobalStyles from './styles/global';
import { CalculateBugfree } from './pages/calculate-bugfree';

import Incidents from './pages/adminModule/incidents';
import Projects from './pages/adminModule/projects';
import Providers from './pages/adminModule/providers';

import { Switch, BrowserRouter, Route } from 'react-router-dom';
import Reliabilities from './pages/adminModule/reliabilities';
import Severities from './pages/adminModule/severities';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/incident-identification' component={IncidentIdentification} />
          <Route path='/severity-registration' component={SeverityRegistration} />
          <Route exact path='/register-project' component={RegisterProject} />
          <Route exact path='/register-provider' component={RegisterProvider} />
          <Route exact path='/calculate-bugfree' component={CalculateBugfree} />
          <Route path='/confidence-level' component={ConfidenceLevel} />
          <Route exact path='/admin/incidents' component={Incidents} />
          <Route exact path='/admin/projects' component={Projects} />
          <Route exact path='/admin/providers' component={Providers} />
          <Route exact path='/admin/reliabilities' component={Reliabilities} />
          <Route exact path='/admin/severities' component={Severities} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
