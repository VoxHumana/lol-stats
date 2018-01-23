import React from 'react';
import Region from './Region';
import Regions from '../regions'
import {
  Input,
  InputGroup,
  InputGroupButton,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';

export default class SummonerSearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      region: 'Region',
      summonerName: '',
      isValid: false,
      showError: false,
    };
    this.regions = Regions.map((region) =>
      <Region key={region} region={region} handleClick={this.selectRegion}/>
    );
  }

  toggle = () =>
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });


  selectRegion = (e) => {
    e.preventDefault();
    this.setState({
      region: e.target.textContent,
    })
  };

  onClickSummon = async () => {
    if (this.state.isValid) {
      try {
        const req = new Request(`/summoner/${this.state.summonerName}?region=${this.state.region}`);
        const res = await fetch(req);
        const data = await res.json();
        this.props.onFetchSummonerMatches(data);
      } catch (err) {
        this.props.onFetchError(err);
      }
    } else {
      this.props.onShowError();
      this.setState({
        showError: true,
      });
    }
  };

  handleInputChange = (e) => {
    this.props.onHideError();
    const inputName = e.target.value;
    const isValid = /^[\w\s]{3,16}$/g.test(inputName);
    this.setState({
      isValid: isValid,
      summonerName: inputName,
      showError: false,
    })
  };


  render() {
    return (
      <InputGroup
        size="lg"
      >
        <Input
          id="summoner-input-form"
          placeholder="Summoner Name"
          type="text"
          value={this.state.summonerName}
          onChange={this.handleInputChange}
        />
        <InputGroupButton>
          <ButtonGroup>
            <Dropdown
              isOpen={this.state.dropdownOpen}
              toggle={this.toggle}
              size="lg">
              <DropdownToggle caret
                              className="rounded-0"
              >
                {this.state.region}
              </DropdownToggle>
              <DropdownMenu>
                {this.regions}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              size="lg"
              onClick={this.onClickSummon}> Summon
            </Button>
          </ButtonGroup>
        </InputGroupButton>
      </InputGroup>);
  }
}