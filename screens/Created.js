import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button , Text} from 'react-native-elements';

class Created extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render() { 
        return ( 
            <View style={styles.container}>
                <Text>You have successfully created an account</Text>
                <Button
                    type="clear"
                    title="Login"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 15
    },
    input: {
        borderBottomColor: "black",
        borderBottomWidth: 1
    }
})

export default Created;