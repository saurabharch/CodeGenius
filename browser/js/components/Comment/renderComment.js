'use strict';
import React, {Component} from 'react';
import styles from '../graderStyles';
import RaisedButton from 'material-ui/RaisedButton';
import {Tags} from '../../containers/Tag';
import MarkdownWrapper from '../../containers/Markdown';
import Slider from 'material-ui/Slider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

//Replace the buttons with these icons.  Use tooltips to clarify what each button does

import SvgIcon from 'material-ui/SvgIcon';
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file'; //Add Attachment
import ActionLabel from 'material-ui/svg-icons/action/label'; //Add Tag
import ImageExposurePlus1 from 'material-ui/svg-icons/image/exposure-plus-1'; //Add Score
import EditorInsertComment from 'material-ui/svg-icons/editor/insert-comment'; //Add Description (Maybe change to Add Comment)
import ActionList from 'material-ui/svg-icons/action/list'; //Add Criteria
import AVPlaylistAdd from 'material-ui/svg-icons/av/playlist-add'; //Add Solution Code
import CommentToolbar from './CommentToolbar';
import commentStyles from './styles';

class MarkdownIcon extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <SvgIcon viewBox="0 0 1024 1024" {...this.props}>
        <path d="M950.154 192H73.846C33.127 192 0 225.12699999999995 0 265.846v492.308C0 798.875 33.127 832 73.846 832h876.308c40.721 0 73.846-33.125 73.846-73.846V265.846C1024 225.12699999999995 990.875 192 950.154 192zM576 703.875L448 704V512l-96 123.077L256 512v192H128V320h128l96 128 96-128 128-0.125V703.875zM767.091 735.875L608 512h96V320h128v192h96L767.091 735.875z"/>
      </SvgIcon>
    )
  }
}

export default class RenderComment extends Component {
  constructor(props){
    super(props);
    let {contents, isEditing} = props;
    this.state = {
      contents,
      isEditing,
      dialog: {
        title: "",
        actions: [],
        open: false
      }
    }
    // this.updateContents = this.updateContents.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.renderDialog = this.renderDialog.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.handleSubmitDialog = this.handleSubmitDialog.bind(this);
    this.renderMarkdown = this.renderMarkdown.bind(this);
    this.renderScore = this.renderScore.bind(this);
    this.removeItem = this.props.removeItem;
    this.updateContents = this.props.updateContents;
    this.renderDialogHandler = this.renderDialogHandler.bind(this);
    this.tagMethods = this.props.tagMethods;
    this.handleSlider = this.handleSlider.bind(this);
  }
  componentWillReceiveProps(nextProps){
    let {contents, isEditing} = nextProps;
    this.setState({
      contents,
      isEditing
    })
  }
  renderComment = renderComment;
  toggleDialog(){
    let nextDialog = Object.assign({}, this.state.dialog, {open: !this.state.dialog.open})
    this.setState({
      dialog: nextDialog
    })
  }
  renderDialog({title, actions, nested, handles}){
    let nextDialog = Object.assign({}, this.state.dialog, {
      title,
      nested,
      handles,
      open: !this.state.dialog.open
    })
    return ()=> {
      this.setState({
        dialog: nextDialog
      })
    }
  }
  handleSlider(event, value){
    this.updateContents({score: this.state.sliderValue});
  }
  recordSliderValue(event, value){
    this.setState({sliderValue: value})
  }
  renderScore(){
    let {contents, isEditing} = this.state;
    let buttonStyle = styles.assessmentButtons;
    let scoreStyle = {fontSize: '20px'};
    return (
      <div>
        <p style={scoreStyle}>
          {(contents.score) ? (<span>Score: {contents.score}</span>) : null }
        </p>
        <div>
        {(
          isEditing ? (
            <span>
              <Slider
              description={'Choose a score for this comment, between -5 and 5.'}
              max={5}
              min={-5}
              step={0.5}
              defaultValue={contents.score || 1}
              value={contents.score}
              onChange={this.recordSliderValue.bind(this)}
              onMouseUp={
                this.handleSlider
              }
              />
            </span>
          ) : (null)
        )}
        </div>
      </div>
    )
  }
  renderDialogHandler(){
    let {contents, isEditing} = this.state;
    let buttonStyle = styles.assessmentButtons;
    return this.renderDialog(
        {
          title: "Add Markdown",
          nested: (
            <div>
            <MarkdownWrapper
            handleOnBlur={(event, updateContents = this.updateContents) => {
              updateContents({markdown: event.target.value})
            }}
            markdown={"#Add Markdown here"}
            editable={true}
            />
            </div>
          )
        }
      )()
  }
  renderMarkdown(){
    let {contents, isEditing} = this.state;
    let buttonStyle = styles.assessmentButtons;
    return (
      <span>
    { (!contents.markdown && isEditing) ? null : (
      <div>
        <MarkdownWrapper
          markdown={contents.markdown}
          handleOnChange={
            (event, updateContents = this.updateContents) => {
              updateContents({markdown: event.target.value})
            }
          }
          editable={isEditing}  />
      </div>
    ) }
    </span>
    )
  }
  handleSubmitDialog(){
    this.toggleDialog();
  }
  render(){
    return (
      <span>
        {this.renderComment()}
      </span>
    )
  }
}

function renderComment () {
    let {contents, isEditing} = this.state;
    let buttonStyle = styles.assessmentButtons;
    let id = 0;
    return (
      <div>
        <span key={id++} >
          <CommentToolbar
            style={commentStyles.CommentToolbar}
            removeItem={this.props.removeItem}
            editMode={this.props.editMode}
            editButton={this.props.editButton}
            contents={this.state.contents}
            addMarkdownHandler={this.renderDialogHandler}
            {...this.props}
          />
        </ span>
        <span key={id++}>
          {this.renderScore()}
        </span>
        <span key={id++} >
          {this.renderMarkdown()}
        </span>
        <span key={id++}>
          {/* (!contents.solutionCodeLink && isEditing) ? <RaisedButton style={buttonStyle} label="Add Solution Code" /> : "" */}
        </span>
        <span key={id++}>
          {/* (!contents.attachments && isEditing) ? <RaisedButton style={buttonStyle} label="Add Attachment" /> : ""*/}
        </span>
        <span key={id++}>
          { (!contents.selection) ? (isEditing ? <RaisedButton style={buttonStyle} label="Add Annotation" /> : "") : (
        <div>
          <div>
            <pre>
              {contents.annotation && contents.annotation.selectionString ? contents.annotation.selectionString : null}
            </pre>
          </div>
          {/*< FlatButton href="/grade">Go to Code</ FlatButton>*/}
        </div>
      ) }
        </span>
        <span key={id++}>
            <Tags
              {...this.props}
            />
        </span>
        <span key={id++}>
      {/* (!contents.criteria && isEditing) ? <RaisedButton style={buttonStyle} label="Add Criteria" /> : contents.criteria */}
        </span>
        <span>
          <Dialog
            modal={false}
            open={this.state.dialog.open}
            actions={[
              <RaisedButton onClick={this.handleSubmitDialog}>Done</RaisedButton>
            ]}
            title={this.state.dialog.title}
          >
            {this.state.dialog.nested}
          </Dialog>
        </span>
      </div>)
  }
