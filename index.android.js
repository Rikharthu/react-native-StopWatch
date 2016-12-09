import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableHighlight} from 'react-native';
var formatTime = require('minutes-seconds-milliseconds');

var StopWatch = React.createClass({

  // set initial variables (gets called automatically)
  getInitialState: function () {
    // do not put any logic here only return initial state of the components
    return {
      timeElapsed: null,
       running: false, 
       startTime: 0,
       laps: []
      }
  },

  render: function () {
    return (
      <View style={styles.container}>
        <View style={[styles.header]}>
          <View style={[styles.timerWrapper]}>
            <Text style={styles.timer}>
              {// since setState() re-renders all the components, text gets updated
              formatTime(this.state.timeElapsed)
}
            </Text>
          </View>
          <View style={[styles.buttonWrapper]}>
            {this.startStopButton()}
            {this.lapButton()}
          </View>
        </View>

        <View style={[styles.footer]}>
          {this.laps()}
        </View>
      </View>
    );
  },
  laps:function(){
    return this.state.laps.map(function(value, index){
      return <View key={index} style={styles.lap}>
        <Text style={styles.lapText}>
          Lap #{index+1}
        </Text>
        <Text style={styles.lapText}>
          {formatTime(value)}
        </Text>
      </View>
    })
  },
  startStopButton: function () {
    var style = this.state.running? styles.stopButton : styles.startButton;

    return <TouchableHighlight
      style={[styles.button, style]}
      underlayColor="gray"
      onPress={this.handleStartPress}>
      <Text>
        {this.state.running ? 'Stop' : 'Start'}
      </Text>
    </TouchableHighlight>
  },
  lapButton: function () {
    return <TouchableHighlight 
      underlayColor="gray" 
      style={styles.button}
      onPress={this.handleLapPress}>
      <Text>
        {this.isPaused()? 'Reset' : 'Lap'}
      </Text>
    </TouchableHighlight>
  },
  handleStartPress: function () {
    console.log('Start was pressed');

    if (this.state.running) {
      this.setState({running: false});
      clearInterval(this.intervalID);
      this.setState({
        startTime: this.state.timeElapsed
      })
      return
    }
    this.setState({
        startTime: new Date()
      })    
    
    // execute this function every 30 millis
    this.intervalID = setInterval(() => {
      // Update our state with some new value setState
      this.setState({
        // startTime doesnt change, it's the time user pressed the button
        timeElapsed: new Date() - this.state.startTime,
        running: true
      })
      // ACHTUNG! By default, setState() method re-renders all the components => Never
      // do it this way! this.state.timeElapsed= new Date();
    }, 30)

  },
  handleLapPress: function(){
    if(this.isPaused()){
      // clear laps
      this.setState({
        laps:[],
        timeElapsed:0,
        startTime:0
      })
      // reset timer

    }else{
      // save lap
      var lap = this.state.timeElapsed;
      // reset timer and update laps
      this.setState({
        startTime: new Date(),
        laps: this.state.laps.concat([lap])
      })
    }
  },
  border: function (color) {
    return {borderColor: color, borderWidth: 4}
  },
  // time is not 0 and is not running
  isPaused: function(){
    return !this.state.running && this.state.timeElapsed>0;
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1, // Fill in the entire screen
    alignItems: 'stretch' // Take as much space as possible in the alignItems direction (horizontal)
  },
  header: { // Yellow
    flex: 1
  },
  footer: { // Blue
    flex: 1
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  timer: {
    fontSize: 60,
    color: 'black'
  },
  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    borderColor: '#00CC00'
  },
  stopButton: {
    borderColor: '#CC0000'
  },
  lapText:{
    color:'black',
    fontSize: 30
  },
  lap:{
    justifyContent:'space-around',
    flexDirection:'row'
  }
})

AppRegistry.registerComponent('stopwatch', () => StopWatch);
