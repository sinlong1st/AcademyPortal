import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TextInput, Dimensions } from 'react-native';
import { ListItem, Divider, Button, Overlay, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { getComments, addComment, clearErrors, clearSuccess } from '../actions/exerciseActions';

import isEmptyObj from '../validation/is-empty'; 


const SCREEN_HEIGHT = Dimensions.get('window').height;

class Exercise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text:'',
      isVisible: false,
      loading: true,
      comments: [],
      isLoadSubmit: false
    };
  }

  componentWillReceiveProps(nextProps) {
    
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoadSubmit: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.mes === "Bình luận của bạn đã được gửi") {
      this.setState({
        text:'',
        isLoadSubmit: false
      })
      this.props.clearSuccess();
    }

    if (!isEmptyObj(nextProps.comments)) {
      const { exercise_comments, loading } = nextProps.comments
      const { comments } = exercise_comments
      this.setState({
        comments,
        loading
      })
    }
  }

  onOpenOverlay = e => {
    e.preventDefault();

    this.props.getComments(this.props.exercise._id);
    this.setState({
      isVisible: !this.state.isVisible
    });
  }

  onCloseOverlay = e => {
    e.preventDefault();

    this.setState({
      isVisible: !this.state.isVisible
    });
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.clearErrors();
    const commentData = {
      text: this.state.text
    };
    this.setState({
      isLoadSubmit: true
    });
    this.props.addComment(commentData, this.props.exercise._id);
  }

  render() {
    const { comments, loading, isLoadSubmit } = this.state
    return (
      <View>
        <Button
          title="Bình luận"
          buttonStyle={{
            backgroundColor: 'grey',
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 30,
          }}
          containerStyle={{ marginVertical: 10, height: 50 }}
          titleStyle={{ fontWeight: 'bold' }}
          onPress={this.onOpenOverlay}
        />
        <Overlay isVisible={this.state.isVisible} fullScreen={true}>
          <View style={{height: SCREEN_HEIGHT, flex: 1}}>
            <Icon
              name='times'
              type='font-awesome'
              onPress={this.onCloseOverlay}
              containerStyle={{
                alignSelf: 'flex-end'
              }}
            />
            <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
            {
              loading
              ?
              <View style={styles.container}> 
                <ActivityIndicator size="large" />
              </View>
              :
              <ScrollView>
                <View style={{flex:1, marginBottom:40}}>
                {
                  comments.length === 0
                  ?
                  <Text>Không có bình luận nào</Text>
                  :
                  comments.map(comment=>
                    <View key={comment._id} style={{marginTop:10}}>
                      <ListItem
                        leftAvatar={{ rounded: true, source: { uri: comment.user.photo } }}
                        title={comment.user.name}
                        subtitle={comment.user.email}
                      />  
                      <Text style={{marginLeft:74, marginTop:-10}}>{comment.text}</Text>
                    </View>
                  )
                }
                </View>
              </ScrollView>
            }
            <Divider style={{ backgroundColor: 'grey', marginTop: 20, marginBottom:20}} />
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={{height: 40, width: 270, borderColor: 'gray', borderWidth: 1, borderRadius: 8}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />
              <Button
                containerStyle={{ marginLeft:10 }}
                icon={{
                  name:'paper-plane',
                  type:'font-awesome',
                  color: "white"
                }}
                onPress={this.onSubmit}
                loading={isLoadSubmit}
              />
            </View>

          </View>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});


const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  comments: state.comments
});

export default connect(mapStateToProps, { getComments, addComment, clearErrors, clearSuccess  })(Exercise); 