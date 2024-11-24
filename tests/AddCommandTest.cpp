#include <gtest/gtest.h>
#include <vector>
#include "../inc/AddCommand.h"

using namespace std;

// Check illegal arguments
TEST(AddCommandTest, CheckIllegalArguments) {
  //AddCommand* m = new AddCommand();
  // One argument is illegal
  //EXPECT_THROW(m->execute(vector<string>{"add"}), std::invalid_argument);
}

// Check info method
TEST(AddCommandTest, CheckInfo) {
  //ASSERT_EQ(AddCommand().info(), "add [userid] [movieid1] [movieid2] …");
}
