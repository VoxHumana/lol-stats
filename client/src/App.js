import {
  Container,
  Row,
  Col, Alert,
} from 'reactstrap';
import React, { Component } from 'react';
import './App.css';
import SummonerSearchBox from './components/SummonerSearchBox';
import HeaderImage from './components/HeaderImage';
import Caption from './components/Caption';
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

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      matchList: null,
      displayMatchList: false,
      isLoading: false,
      showError: false,
      errorMessage: null,
    }
  }

  onFetchSummonerMatches = (res) => {
    const matchList = res.map( (match) => {
      const spells = match.summonerSpells.map( (spell) => <SummonerSpell summonerSpellImgSrc={spell.image} />
      );
      const summoners =
        <SummonerSpells spell1={spells[0]} spell2={spells[1]} />;
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
    this.setState({
      matchList: matchList
    });
  };

  onFetchError = () => {
    this.setState({
      showError: true,
      errorMessage: 'Embrace the darkness...(error retrieving summoner data)',
    })
  };

  onShowError = () => {
    this.setState({
      showError: true,
      errorMessage: 'Invalid summoner name!',
    })
  };

  onHideError = () => {
    this.setState({
      showError: false,
    })
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
            <Col xs="12">
              <Caption />
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <SummonerSearchBox
                onFetchSummonerMatches={this.onFetchSummonerMatches}
                onFetchError={this.onFetchError}
                onShowError={this.onShowError}
                onHideError={this.onHideError}/>
              <Alert className="error" color="danger" isOpen={this.state.showError}>{this.state.errorMessage}</Alert>
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
