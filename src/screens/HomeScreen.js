import React from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator, FlatList, TouchableOpacity, Container} from 'react-native';
import Header from '../components/Header';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: true,
      dataSource:[]
    }
  }

  componentDidMount(){
    var details = {
      'username': this.props.navigation.state.params.Login,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    //192.168.1.14
    //192.168.43.41
    fetch("http://192.168.1.14:9090/datasByUsers/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    }).then(response => response.json())
      .then((responseJson)=> {
        this.setState({
          loading: false,
          refreshing: false,
          dataSource: responseJson
        })
      })
      .catch(error=>console.log(error))
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.componentDidMount();
    })
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{
        height: .5,
        width:"100%",
        backgroundColor:"rgba(0,0,0,0.5)",
      }}/>
    );
  }

  renderItem=(data)=>
    <TouchableOpacity style={styles.list}>
      <Text style={styles.lightText}>{data.item.nameSensor}</Text>
      <Text style={styles.lightText}>{data.item.datasensor}</Text>
      <Text style={styles.lightText}>{data.item.datetimedata}</Text>
    </TouchableOpacity>

    render() {
        return (
          <View style={styles.container}>
            <Header>Vos données</Header>
            <FlatList
              data= {this.state.dataSource}
              ItemSeparatorComponent = {this.FlatListItemSeparator}
              renderItem= {item=> this.renderItem(item)}
              keyExtractor= {item=>item.iddata.toString()}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    padding : 20
  },
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  list:{
    paddingVertical: 4,
    margin: 5,
    backgroundColor: "#fff"
  }
});
