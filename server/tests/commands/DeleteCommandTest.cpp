#include <gtest/gtest.h>
#include "commands/DeleteCommand.h"
#include "data_manager/LocalDataManager.h"
#include "../utils/TestUtils.h"

// Delete data from the file and check it
TEST(DeleteCommandTest, CheckCorrectDataDeletion) {
    IDataManager* dataManager = new LocalDataManager();
    DeleteCommand deleteCommand(dataManager);

    // Ensure the test file is clean and ready for writing
    string testFilePath = "data/users.txt";
    ofstream outFile(testFilePath, ofstream::trunc); // Open in trunc mode to clear content

    // Fill file with data
    for (const auto& dataLine : TestUtils::testData) {
        outFile << dataLine.second << endl; // Write data to a file
    }
    outFile.close();

    // Run through each test case in the vector
    for (const auto& testCase : TestUtils::modifiedData) {
        const vector<string>& command = testCase.first;
        const string& expectedLine = testCase.second;

        // Act
        string res = deleteCommand.execute(command);
        EXPECT_EQ(res, StatusCodes::NO_CONTENT);

        // Assert
        vector<string> fileLines = TestUtils::readFileLines(testFilePath);     // Read file
        auto it = find(fileLines.begin(), fileLines.end(), expectedLine);
        EXPECT_NE(it, fileLines.end());
    }

    // Try to delete a non-existing movie
    EXPECT_THROW(deleteCommand.execute(vector<string>{"DELETE", "1", "999"}), StatusCodeException);
}

// Check illegal arguments
TEST(DeleteCommandTest, CheckIllegalArguments) {
    IDataManager* dataManager = new LocalDataManager();

    DeleteCommand* m = new DeleteCommand(dataManager);

    // Zero arguments are illegal
    EXPECT_THROW(m->execute(vector<string>{}), StatusCodeException);

    // One argument is illegal
    EXPECT_THROW(m->execute(vector<string>{"DELETE"}), StatusCodeException);

    // Two arguments are also illegal
    EXPECT_THROW(m->execute(vector<string>{"DELETE 1"}), StatusCodeException);
}


// Check info method
TEST(DeleteCommandTest, CheckInfo) {
    IDataManager* dataManager = new LocalDataManager();
    EXPECT_EQ(DeleteCommand(dataManager).info(), "DELETE, arguments: [userid] [movieid1] [movieid2] …");
}