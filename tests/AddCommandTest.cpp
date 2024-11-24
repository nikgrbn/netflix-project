#include <gtest/gtest.h>
#include <vector>
#include "../inc/AddCommand.h"

using namespace std;

// Check illegal arguments
TEST(AddCommandTest, CheckIllegalArguments) {
  EXPECT_THROW(AddCommand(vector<string>{"add"}), std::invalid_argument);
}

// Check info method
TEST(AddCommandTest, CheckInfo) {
  ASSERT_EQ(AddCommand(vector<string>()).info(), "add [userid] [movieid1] [movieid2] …");
}
