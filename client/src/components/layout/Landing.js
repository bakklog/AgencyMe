import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Landing extends Component {
    render() {
        return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-dark">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Agency Manger
                </h1>
                <p className="lead"> Leverage agile frameworks to provide a robust synopsis for high level overviews. </p>
                    <Link className="btn btn-lg btn-info mr-2" to="/signup">Sign Up</Link>
                    <Link className="btn btn-lg btn-dark" to="/login">Login</Link>
              </div>
              </div>
            </div>
          </div>
      </div>
        )
    }
}
export default Landing;