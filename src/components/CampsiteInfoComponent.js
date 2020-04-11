import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Col} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger} from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const selOption = val => val;

function RenderCampsite({campsite}){
    return(
        <div className='col-md-5 m-1'>
            <FadeTransform
                in 
                transformProps={{
                 exitTransform: 'scale(0.5) translateY(50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
    }

function RenderComments({comments, postComment, campsiteId}){
    if(comments){
        return(
            <div className='col-md-5 m-1'>
                <h4>Comments</h4>
                <Stagger in>
                    {comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text}</p>
                                    <p>{comment.author} <br />
                                        {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>
        );
    }
    return <div />

    }

function CampsiteInfo(props){
    if(props.isLoading){
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if(props.errMess){
         return(
             <div className="container">
                 <div className="row">
                     <div className="col">
                         <h4>{props.errMess}</h4>
                    </div>
                 </div>
             </div>
         );
    }
    if(props.campsite){
        return(
            <div className='container'>
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className='row'>
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments} 
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        )
    }
    return <div />;

}

class CommentForm extends Component{

    constructor(props){
        super(props);


        this.state = {
            isModelOpen: false
        };
        
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
     handleSubmit(values){
         this.toggleModal();
         this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
        }

    toggleModal(){
        this.setState({
            isModelOpen: !this.state.isModelOpen
        });
    }

    render(){
        return(
            <React.Fragment>
                <Modal isOpen={this.state.isModelOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>                
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="form-group">
                                    <Label htmlFor="rating" md={10}>Rating</Label>
                                    <Col md={10}>
                                        <Control.select model=".rating" name="rating"
                                            className="form-control"
                                            validators={{
                                                required,
                                                selOption
                                            }}
                                        >
                                            <option></option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                        <Errors
                                            className="text-danger"
                                            model=".rating"
                                            show="touched"
                                            component="div"
                                            messages={{
                                                required: 'Required',
                                                selOption: 'Must select a rating'
                                            }}
                                        />
                                    </Col>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="author" md={10}>First Name</Label>
                                    <Col md={10}>
                                        <Control.text model=".author" id="author" name="author"
                                            placeholder="Your Name"
                                            className="form-control"
                                            validators={{
                                                required,
                                                minLength: minLength(2),
                                                maxLength: maxLength(15)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            component="div"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be at least 2 characters',
                                                maxLength: 'Must be 15 characteres or less'
                                            }}
                                        />
                                    </Col>
                                </div>

                                <div className="form-group">
                                    <Label htmlFor="feedback" md={2}>Comment</Label>
                                    <Col md={10}>
                                        <Control.textarea model=".text" id="text" name="text"
                                            rows="12"
                                            className="form-control"
                                        />
                                    </Col>
                                </div>
                                <div className="form-group">
                                    <Col md={{size: 10, offset: 2}}>
                                        <Button type="submit" color="primary">
                                            Submit
                                        </Button>
                                    </Col>
                                </div>
                            </LocalForm>
                        </ModalBody>
                </Modal>
                <Button outline onClick={this.toggleModal}>
                <i className="fa fa-pencil"></i>
                    Submit Comment
                </Button>
            </React.Fragment>
        );
    }
}


export default CampsiteInfo;