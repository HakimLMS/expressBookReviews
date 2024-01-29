const searchObject = (objects, property, value) => {
    var objectsFound = [];
    for (let key in objects) {
        let searchObject = objects[key];
        if (searchObject[property].toLocaleLowerCase().includes(value)) {
            objectsFound.push(searchObject);
        }
    }

    return objectsFound;
}

const replacePropertyInObject = (object, haystack, needle, property, value, nestedProperty) => {
    for (let key in object[property]) {
        var searchObject = object[property][key]
        for (let objProp in searchObject) {
            if (objProp === haystack && searchObject[haystack] === needle) {
                searchObject[nestedProperty] = value;
                return true
            }
        }
    }

    return false
}

module.exports.searchObject = searchObject
module.exports.replacePropertyInObject = replacePropertyInObject