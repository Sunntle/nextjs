const getFallBackName = (name: string) => {
  const splitName = name.split(" ");
  return (
    splitName[0].toUpperCase().slice(0, 1) +
    splitName[1]?.toUpperCase().slice(0, 1)
  );
};
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const truncateString = (string:string, length: number) =>{
  if(!string || string.length <= length) return string
  return string.slice(0, length) + `...`
}
export { getFallBackName, formatter, truncateString };
