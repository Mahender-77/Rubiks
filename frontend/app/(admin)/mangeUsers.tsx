import { Text, View } from "react-native"

export const mangeUsers = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0EA5E9', padding: 20 }}>
                Manage Users
            </Text>
            {/* Add your manage users content here */}
        </View>
    )
}