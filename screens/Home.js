import React from "react";
import { StyleSheet, Dimensions, View, FlatList, Image, ScrollView } from "react-native";
import { Block, theme, Text } from "galio-framework";
import HomeHeader from "../components/HomeHeader"
import { Card, Button } from "../components";
import articles from "../constants/articles";
import axios from "../assets/config/axios"
import { TouchableOpacity } from "react-native-gesture-handler";
import DefaultImage from "../assets/imgs/profile-pic.png"
import OtherUSerDetails from "./otherUserDetails"
import BottomBar from "../components/bottomBar"
import { connect } from 'react-redux';
const { width } = Dimensions.get("screen");

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      my_users_list: null,
      selectedUser: null,
      selectedCategouries: null,
      my_user_list_after_filter: null
    }
  }
  componentDidMount() {
    let params = {}

    axios.post("/getMyUsersList", params).then(res => {
      console.log( res.data , "lllllllllllllllllllllllllllllllllllllllllllllllll")
      this.setState({ my_users_list: res.data, my_user_list_after_filter: res.data })
    }).catch(error => {
      console.log(error)
    })
  }


  getInputValue = (e) => {

    let newUserList = this.state.my_users_list.filter((ele) => {
      return ele[`full_name`] && ele[`full_name`].includes(e);
    })
    this.setState({ my_user_list_after_filter: newUserList });

  }
  renderArticles = () => {
    return (
      <>
        <HomeHeader search getInputValue={this.getInputValue} />

        {
          // this.state.selectedUser ?
          //   <View style={{marginTop:-470}}>
          //     <OtherUSerDetails />

          //   </View>
          //   :
          this.state.my_user_list_after_filter && Array.isArray(this.state.my_user_list_after_filter) &&

          <ScrollView


            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
          >
            {this.state.my_user_list_after_filter.map(ele => {
              return (
                <TouchableOpacity style={styles.home} onPress={() => {
                  this.setState({ selectedUser: ele.id, selectedCategouries: ele.categouries })

                  this.props.selectUser({ selected_user_id: ele.id, selected_user_categouries: ele.categouries })
                  this.props.navigation.navigate('OtherUserDetails')
                }}>

                  <Card item={{
                    title: ele.full_name,
                    image: ele.imageURL ? ele.imageURL : require("../assets/imgs/profile-pic.png"),
                    horizontal: true

                  }} horizontal />
                </TouchableOpacity>


              );
            })}
          </ScrollView >

        }


      </>
    );
  };

  render() {
    return (
      // <Block flex center style={styles.home}>
      this.renderArticles()
      // </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    marginLeft: 20,
    position: "absolute",
    left: 70,
    fontSize: 18,
    fontWeight: "bold",
  },
});


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  selectUser: value => dispatch({ type: 'select_user_from_my_list', payload: value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);





