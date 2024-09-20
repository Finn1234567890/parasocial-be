const { supabase } = require("../lib/supabase")

const resetUserSearches = async () => {
    const { error } = await supabase
        .from('users')
        .update('search_restriction', 3)

    if(error) { console.log("There was an error resetting search_restriction")}
}

const resetUserCreates = async () => {
    const { error } = await supabase
        .from('users')
        .update('create_restriction', 1)

    if(error) { console.log("There was an error resetting search_restriction")}
}


module.exports = { resetUserSearches, resetUserCreates }