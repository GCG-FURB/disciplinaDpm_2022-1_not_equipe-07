import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export default function App() {

    const [position, setPosition] = useState({
            latitude: -26.914134,
            longitude: -49.068738,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            accuracy: 999999.99,
        },
    );

    function obterLocalizacao(enableHighAccuracy, timeout) {
        useEffect(() => {
            Geolocation.getCurrentPosition((position) => {
                    setPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy.toFixed(2),
                        latitudeDelta: 0.0421,
                        longitudeDelta: 0.0421,
                    });
                },(error) => {
                    console.log('[DEV_APP] error' + error.message);
                },
                { enableHighAccuracy: enableHighAccuracy, timeout: timeout, maximumAge: 1000 },
            );
        }, []);
    }

    function obterTitulo() {
        return 'Você está na latitude: ' + position.latitude + ' e longitude: ' + position.longitude;
    }

    function obterDescricao() {
        return 'Precisão: ' + position.accuracy;
    }

    obterLocalizacao(true, 2000);
    obterLocalizacao(false, 20000);

    return (
        <MapView
            style={styles.map}
            initialRegion={ position }
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
        >
            <Marker
                title={ obterTitulo() }
                description={ obterDescricao() }
                coordinate={ position }
            />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
