// remove "(ND)" and cut overly long labels
export default function process(input,output) {

  const maxLen = 26

  if(!output.categories.coicop18shortened) {
    output.categories.coicop18shortened = new Map()
  }

  output.categories.coicop18.forEach((label, key) => {
    const s = " (ND)"
    if(label.includes(s)) {
      let newLabel = label.replace(s,"")
      if(newLabel.length-5>maxLen) {
        newLabel = newLabel.substring(0,maxLen)+"..."
      }
      output.categories.coicop18shortened.set(key,newLabel)
    } else {
      if(label.length>maxLen) {
        const newLabel = label.substring(0,maxLen)+"..."
        output.categories.coicop18shortened.set(key,newLabel)
      } else {
        output.categories.coicop18shortened.set(key,label)
      }
    }
  })

}