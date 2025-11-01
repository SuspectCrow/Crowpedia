import {View, Text} from 'react-native'
import React from 'react'

const Search = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#292524',
            }}>
            <Text className=" font-dmsans-black text-4xl text-red-600">Search</Text>
        </View>
    )
}
export default Search
