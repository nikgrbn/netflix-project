#include "data_manager/LocalDataManager.h"
#include <gtest/gtest.h>
#include <vector>
#include "commands/PatchCommand.h"
#include "../utils/TestUtils.h"

using namespace std;

// Use add command to add data to the file and check it
TEST(PatchCommandTest, CheckCorrectDataAddition) {
    const TestUtils& testUtils = TestUtils::getInstance();
    // Require the test file be filled with data.
    testUtils.prepareTest("PATCH");

    IDataManager* dataManager = new LocalDataManager();
    PatchCommand patchCommand(dataManager);

    // Run through each test case in the vector
    const auto& testData = testUtils.getTestData("PATCH");
    for (const auto& testCase : testData) {
        const vector<string>& command = testCase.first;
        const string& expectedLine = testCase.second;

        // Act
        patchCommand.execute(command);

        // Assert
        vector<string> fileLines = TestUtils::readFileLines();     // Read file
        auto it = find(fileLines.begin(), fileLines.end(), expectedLine);
        EXPECT_NE(it, fileLines.end()) << "Failed searching for " << expectedLine;
    }
}

// Check illegal arguments
TEST(PatchCommandTest, CheckIllegalArguments) {
  IDataManager* dataManager = new LocalDataManager();
  PatchCommand* m = new PatchCommand(dataManager);

  // Zero arguments are illegal
  EXPECT_THROW(m->execute(vector<string>{}), StatusCodeException);

  // One argument is illegal
  EXPECT_THROW(m->execute(vector<string>{"PATCH"}), StatusCodeException);

  // Two arguments are also illegal
  EXPECT_THROW(m->execute(vector<string>{"PATCH 12"}), StatusCodeException);
}

TEST(PatchCommandTest, CheckInfo) {
  IDataManager* dataManager = new LocalDataManager();
  EXPECT_EQ(PatchCommand(dataManager).info(), "PATCH, arguments: [userid] [movieid1] [movieid2] …");
}


