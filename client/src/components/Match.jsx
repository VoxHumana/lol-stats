import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';

export default class Match extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row
        className="match-container"
      >
        <Col xs="12">
          <Card className={this.props.win ? 'bg-success' : 'bg-danger'}>
            <CardBody>
              <Container>
                <Row>
                  <Col
                    xs="3"
                  >
                    {this.props.championDetails}
                  </Col>
                  <Col
                    xs="3"
                  >
                    {this.props.kda}
                  </Col>
                  <Col
                    xs="2"
                  >
                    {this.props.stats}
                  </Col>
                  <Col
                    xs="4"
                  >
                    {this.props.items}
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
