export function convertReturnReasonToTigrigna(v,def){
    switch(v){
      case 'damagedProduct':
        return "ዝተጎድአ ኣቅሓ";
      case "unwantedItem":
        return "ዘይተደለየ ኣቕሓ";
      case "wrongSize":
        return "ዝተጋገየ ዓቐን";
      default :
        return def;
    }
}
export function convertReturnStatusToTigrigna(v,def){
    switch(v){
      case 'received':
        return "ተቐቢሉ";
      case "inspected":
        return "ተመርሚሩ";
      case "refunded":
        return "ዳግማይ ተቐሚጡ";
      case "restocked":
            return "ሒሳብ ተመሊሱ";
      default :
        return def;
    }
  }