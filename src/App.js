import React, { Component } from 'react';
import './App.css';
import jQuery from 'jquery';

const clientId = "3b6e95d69e8ca51afc0b"
const clientSecret = "9b69e7acdb76895ae20f2347b5a49f1b05bcc334"
const urlNoRateLimited = "?client_id="+clientId+"&client_secret="+clientSecret
const urlRoot = "https://api.github.com/repos/Anuswan91/RIsk_online/contents"+urlNoRateLimited

class Tree extends Component{

  setTree(element){
    this._name = element['name']
    this._type = element['type']
    this._url = element['url']
    this._children = []
  }

  addChild(element){
    this._children.push(element)
  }

  addChildParam(element){
    this._children.push(new Tree())
    this.getChild(this._children.length - 1).setTree(element)
    return this._children.length - 1
  }
  
  getName(){
    return this._name
  }

  getType(){
    return this._type
  }

  getUrl(){
    return this._url
  }

  isDirectory(){
    if (this._type === "dir") {
      return true
    }
    else{
      return false
    }
  }

  hasChildren(){
    return (jQuery.isEmptyObject(this._children))
  }

  getChildren(){
    return this._children
  }

  getChild(i){
    return this._children[i]
  }

  renderIcon(size = "small"){
    var sourceIcon = ""
    if (this.isDirectory()){
      sourceIcon = "icon-folder-"+size+".png"
    }
    else{
      sourceIcon = "icon-file-"+size+".png"
    }
    return <span><img src={sourceIcon} alt={this.getName()}/></span>
  }

  renderNbChildren(){
    if(this.isDirectory()){
      return "("+this.getChildren().length+")"
    }
    else{
      return ""
    }
  }

  render(){
    return (
      <div className={this.getType()}>
        <p>
          {this.renderIcon()} {this.getName()} {this.renderNbChildren()} 
        </p>   
        <div className="content">
        {
          this.getChildren().map(function(child){
            return (
              <div>
                {child.render()}
              </div>
              )
          })
        }  
        </div>        
      </div>
      )
  }
}

class App extends Component {
  setDataGithub(){
    var rootTreeArray = {
      "name" : "Source",
      "type" : "dir",
      "url" : urlRoot
    }
    var rootTree = new Tree()
    rootTree.setTree(rootTreeArray)
    this.rootTree = rootTree
  }
  
  fetchDataFromGithubApi(treeParent){
    jQuery.get((treeParent.getUrl()+urlNoRateLimited).replace("?ref=master", ""), function(result) {
      result.forEach(function(element){
        var index = treeParent.addChildParam(element)
        this.setState({
          rootTree: this.rootTree
        })
        if (treeParent.getChild(index).isDirectory()) {
          this.fetchDataFromGithubApi(treeParent.getChild(index))
        }
      }.bind(this))
    }.bind(this))
  }

  componentWillMount(){
    this.setDataGithub()
    this.fetchDataFromGithubApi(this.rootTree)    
    
    this.setState({
      rootTree: this.rootTree
    })
  }

  render() {
    return (
      <div className="App">
        {
          this.state.rootTree.render()
        }
      </div>
    );
  }
}

export default App;
