import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handle: '',
            company: '',
            position: '',
            skills: '',
            githubusername: '',
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    onSubmit(e) {
        e.preventDefault();

        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            position: this.state.position,
            skills: this.state.skills,
            githubusername: this.state.githubusername
        };

        this.props.createProfile(profileData, this.props.history);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { errors } = this.state;

        return (
            <div className="create-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Create your profile</h1>
                            <p className="lead text-center">
                                Lets get some information to make your profile stand out
                            </p>
                            <small className="d-block pb-4">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder="* Profile handle"
                                    name="handle"
                                    value={this.state.handle}
                                    onChange={this.onChange}
                                    errors={errors.handle}
                                    info="A unique handle for your profile URL. Your full name, company name, nickname"
                                />
                                <TextFieldGroup
                                    placeholder="Company"
                                    name="company"
                                    value={this.state.company}
                                    onChange={this.onChange}
                                    errors={errors.company}
                                    info="Your company name"
                                />
                                <TextFieldGroup
                                    placeholder="Position"
                                    name="position"
                                    value={this.state.position}
                                    onChange={this.onChange}
                                    errors={errors.position}
                                    info="Your position at your company."
                                />
                                <TextFieldGroup
                                    placeholder="Skills"
                                    name="skills"
                                    value={this.state.skills}
                                    onChange={this.onChange}
                                    errors={errors.skills}
                                    info="Your skills with spacings"
                                />
                                <TextFieldGroup
                                    placeholder="Github Username"
                                    name="githubusername"
                                    value={this.state.githubusername}
                                    onChange={this.onChange}
                                    errors={errors.githubusername}
                                    info="Your github"
                                />
                                <input
                                    type='submit'
                                    value='Submit'
                                    className='btn btn-info btn-block mt-4'
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
  });

  export default connect(mapStateToProps, { createProfile })(
    withRouter(CreateProfile)
  );