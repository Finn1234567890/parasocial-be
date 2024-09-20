const { supabase } = require("../lib/supabase");

const resetUserSearches = async () => {
  console.log("resseting searches");
  const { error } = await supabase
    .from("users")
    .update({ search_restriction: 3 })
    .not('user_id', 'is', null)
    

  if (error) {
    console.log("There was an error resetting search_restriction", error);
  } else {
    console.log("Successfully reset search restrictions");
  }
};

const resetUserCreates = async () => {
  console.log("resetting creates");
  const { error } = await supabase
    .from("users")
    .update({ create_restriction: 1 })
    .not('user_id', 'is', null)

  if (error) {
    console.log("There was an error resetting create_restriction", error);
  } else {
    console.log("Successfully reset create restrictions");

  }
};

resetUserCreates()
resetUserSearches()

module.exports = { resetUserSearches, resetUserCreates };
