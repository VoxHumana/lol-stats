import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';
import ChampionDetails from './ChampionDetails';
import KDA from './KDA';
import Stats from './Stats';
import ChampionBuild from './ChampionBuild';

export default class Match extends React.Component {
  constructor(props) {
    super(props);
    this.win = props.matchDetails.win;
    this.championDetails = (<ChampionDetails
      champion={props.matchDetails.champion}
      spells={props.matchDetails.summonerSpells}
    />);
    this.kda = (<KDA
      kills={props.matchDetails.kills}
      deaths={props.matchDetails.deaths}
      assists={props.matchDetails.assists}
    />);
    this.stats = (<Stats
      cs={props.matchDetails.cs}
      gold={props.matchDetails.gold}
      level={props.matchDetails.level}
      duration={Math.round(props.matchDetails.gameDuration / 60)}
    />);
    this.build = (<ChampionBuild
      items={props.matchDetails.items}
      trinket={props.matchDetails.trinket}
    />);
  }

  render() {
    return (
      <Row
        className="match-container"
      >
        <Col xs="12">
          <Card className={this.win ? 'bg-success' : 'bg-danger'}>
            <CardBody>
              <Container>
                <Row>
                  <Col
                    xs="3"
                  >
                    {this.championDetails}
                  </Col>
                  <Col
                    xs="3"
                  >
                    {this.kda}
                  </Col>
                  <Col
                    xs="2"
                  >
                    {this.stats}
                  </Col>
                  <Col
                    xs="4"
                  >
                    {this.build}
                  </Col>
                </Row>
              </Container>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
