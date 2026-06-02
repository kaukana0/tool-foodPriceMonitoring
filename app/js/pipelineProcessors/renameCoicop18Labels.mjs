// remove "(ND)"
export default function process(input,output) {
  
  output.categories.coicop18.forEach((value, key) => {
    const s = " (ND)"
    if(value.includes(s)) {
      output.categories.coicop18.set(key, value.replace(s,""))
    }
  })

}