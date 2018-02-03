import {
  Container,
  Row,
  Col, Alert,
} from 'reactstrap';
import React, { Component } from 'react';
import './App.css';
import SummonerSearchBox from './components/SummonerSearchBox';
import HeaderImage from './components/HeaderImage';
import Match from "./components/Match";
import Spinner from "./components/Spinner";
import Regions from "./regions";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      matchList: null,
      displayMatchList: false,
      showError: false,
      errorMessage: null,
    };
    this.spinner = null;
  }

  onFetchSummonerMatches = async (summonerName, region) => {
    try {
      const req = new Request(`/summoner/${summonerName}?region=${Regions[region.toLowerCase()]}`);
      const res = await fetch(req);
      const data = await res.json();
      this.spinner = null;
      this.setState({
        matchList: data.map( (match) => {
          return <Match matchDetails={match}/>;
        }),
      });
    } catch(err) {
      this.onShowError('Embrace the darkness...(error retrieving summoner data)');
    }
  };

  onShowError = (errMsg) => {
    this.spinner = null;
    this.setState({
      showError: true,
      errorMessage: errMsg,
    })
  };

  onHideError = () => {
    this.setState({
      showError: false,
    })
  };

  onLoading = () => {
    this.spinner = <Spinner/>;
    this.setState({
      matchList: null,
    });
  };

  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col xs="12">
              <HeaderImage />
            </Col>
          </Row>
          <Row>
            <Col className="text-center" xs="12">
              <SummonerSearchBox
                onFetchSummonerMatches={this.onFetchSummonerMatches}
                onShowError={this.onShowError}
                onHideError={this.onHideError}
                onLoading={this.onLoading}/>
              <Alert className="error" color="danger" isOpen={this.state.showError}>{this.state.errorMessage}</Alert>
              {this.spinner}
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Container>
                {this.state.matchList}
              </Container>
            </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default App;
