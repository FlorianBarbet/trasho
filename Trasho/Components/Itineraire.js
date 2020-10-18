import GLOBAL from '../Globals';

export const GetItinerary = async (idPoubelle, positionUser) => {
    const url = GLOBAL.BASE_URL + '/api/trash/itineraire/' + idPoubelle
    const body = 'lat='+positionUser.lat+'&lng='+positionUser.lng;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "token_api": GLOBAL.token_api,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });
    const json = await response.json();
    let position = []
    json.forEach(element =>
        position.push(
            { lat: element[1], lng: element[0] }
        )
    );
    return position
}