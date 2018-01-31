import {
  Container,
  Row,
  Col, Alert,
} from 'reactstrap';
import React, { Component } from 'react';
import './App.css';
import SummonerSearchBox from './components/SummonerSearchBox';
import HeaderImage from './components/HeaderImage';
import ChampionDetails from "./components/ChampionDetails";
import SummonerSpell from "./components/SummonerSpell";
import SummonerSpells from "./components/SummonerSpells";
import KDA from "./components/KDA";
import Stats from "./components/Stats";
import ShopItem from "./components/ShopItem";
import Trinket from "./components/Trinket";
import ChampionBuild from "./components/ChampionBuild";
import Match from "./components/Match";
import EmptyItem from "./components/EmptyItem";
import Spinner from "./components/Spinner";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      matchList: null,
      displayMatchList: false,
      isLoading: false,
      showError: false,
      errorMessage: null,
    };
    this.spinner = null;
  }

  onFetchSummonerMatches = (res) => {
    const matchList = res.map( (match) => {
      const spells = match.summonerSpells.map( (spell) => <SummonerSpell summonerSpellImgSrc={spell.image} />
      );
      const summoners =
        <SummonerSpells spells={spells} />;
      const champDetails =
        <ChampionDetails championImgSrc={match.champion.image} championName={match.champion.name}>
          {summoners}
        </ChampionDetails>;
      const kda = <KDA kills={match.kills} deaths={match.deaths} assists={match.assists} />;
      const stats = <Stats cs={match.cs} gold={match.gold} level={match.level} duration={Math.round(match.gameDuration / 60)} />;
      const items = match.items.map( (item) => {
        return item.name === 'empty' ? <EmptyItem/> : <ShopItem itemImgSrc={item.image}/>
      });
      const trinket = <Trinket trinketImgSrc={match.trinket.image}/>;
      const championBuild = <ChampionBuild items={items} trinket={trinket}/>;
      return <Match win={match.win} championDetails={champDetails} kda={kda} stats={stats} items={championBuild}/>;
    });
    this.spinner = null;
    this.setState({
      matchList: matchList,
      isLoading: false,
    });
  };

  onShowError = (errMsg) => {
    this.setState({
      showError: true,
      errorMessage: errMsg,
      isLoading: false,
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
      isLoading: true,
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
