
class PersianCulture {
    static ToPersianNumber(input){
        var inputString = input.toString();
        var correctedString = inputString.replace(/[0-9]/g , function(word){
            return String.fromCharCode(1776+parseInt(word));
        });
        return(correctedString);
    }

}
export default PersianCulture;