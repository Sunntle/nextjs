const getFallBackName = (name:string) =>{
    const splitName = name.split(" ")
    return splitName[0].toUpperCase().slice(0,1) + splitName[1]?.toUpperCase().slice(0,1)
}
export {getFallBackName}