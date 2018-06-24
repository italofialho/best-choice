import React, { Component } from 'react';
import { NavBar } from "../NavBar";
import withAuthorization from "../Session/withAuthorization";

class AdventurePage extends Component {
  render() {
    return (
        <div style={{paddingTop: 50}}>
          <NavBar />
          <h1>Adventure</h1>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(AdventurePage);
