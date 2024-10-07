import { createContext, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export const PlaygroundContext = createContext();

export const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      "#include <bits/stdc++.h>\n" +
      "using namespace std;\n\n" +
      "int main() {\n" +
      '\tcout << "Hello World!";\n' +
      "\treturn 0;\n" +
      "}",
    leetCode1:
      "#include <bits/stdc++.h>\n"+
      "using namespace std;\n\n" +
      "vector<int> twoSum(vector<int>& nums, int target) {\n" +
      "    unordered_map<int, int> mp;\n" +
      "    for (int i = 0; i < nums.size(); i++) {\n" +
      "        int secondElement = target - nums[i];\n" +
      "        if (mp.find(secondElement) != mp.end()){\n" +
      "            return {mp[secondElement], i};\n" +
      "        }\n" +
      "        mp[nums[i]] = i;\n" +
      "    }\n" +
      "    return {};\n" +
      "}\n\n"+
      "int main() {\n" +
      "    vector<int> nums = {2, 7, 11, 15};\n" +
      "    int target = 9;\n" +
      "    vector<int> result = twoSum(nums, target);\n" +
      "    for(int i = 0; i < result.size(); i++){\n" +
      "         cout << result[i] << ' ';\n" +
      "    }\n" +
      "    return 0;\n" +
      "}",
    
    leetCode2:
    //linked list cycle
    "#include <bits/stdc++.h>\n" +
    "using namespace std;\n\n" +
    "struct ListNode\n" +
    "{\n" +
    "   int val;\n" +
    "   ListNode *next;\n" +
    "   ListNode(int x) : val(x), next(nullptr) {};\n" +
    "};\n\n" +
    "bool hasCycle(ListNode *head){\n" +
    "   if (head == NULL) return 0;\n" +
    "   ListNode *slow = head;\n" +
    "   ListNode *fast = head;\n" +
    "   while (fast && fast->next){\n" +
    "      slow = slow->next;\n" +
    "      fast = fast->next->next;\n" +
    "      if (slow == fast) return true;\n" +
    "   }\n" +
    "   return false;\n" +
    "}\n\n" +

    "int main() {\n" +
      "    ListNode *head = new ListNode(3);\n" +
      "    ListNode *two = new ListNode(2);\n" +
      "    ListNode *zero = new ListNode(0);\n" +
      "    ListNode *neg_four = new ListNode(-4);\n" +
      "    head->next = two;\n" +
      "    two->next = zero;\n" +
      "    zero->next = neg_four;\n" +
      "    neg_four->next = head->next;\n" +
      '    cout << (hasCycle(head)? "Yes" : "No") << endl;\n' +
      "    return 0;\n" +
      "}",
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
  },
  python: {
    id: 71,
    defaultCode: `print("Hello World!")`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello World!");`,
  },
  rust: {
    id: 73,
    defaultCode: `fn main() {\n    println!("Hello World!");\n}`,
  },
  php: {
    id: 68,
    defaultCode: `<?php\necho "Hello World!";\n?>`,
  },
};
const PlaygroundProvider = ({ children }) => {
  const initialItems = {
    [uuid()]: {
      title: "DSA",
      playgrounds: {
        [uuid()]: {
          title: "C++ Example",
          language: "cpp",
          code: languageMap["cpp"].defaultCode,
        },
        [uuid()]: {
          title: "Javascript Example",
          language: "javascript",
          code: languageMap["javascript"].defaultCode,
        },
      },
    },
    [uuid()]: {
      title: "LeetCode Questions",
      playgrounds: {
        [uuid()]: {
          title: "Two Sum",
          language: "cpp",
          code: languageMap["cpp"].leetCode1,
        },
        [uuid()]: {
          title: "Linked List Cycle",
          language: "cpp",
          code: languageMap["cpp"].leetCode2,
        },
      },
    },
  };

  const [folders, setFolders] = useState(() => {
    let localData = localStorage.getItem("playgrounds-data");
    if (localData === null || localData === undefined) {
      return initialItems;
    }

    return JSON.parse(localData);
  });

  useEffect(() => {
    localStorage.setItem("playgrounds-data", JSON.stringify(folders));
  }, [folders]);

  const deleteCard = (folderId, cardId) => {
    setFolders((oldState) => {
      const newState = { ...oldState };
      delete newState[folderId].playgrounds[cardId];
      return newState;
    });
  };

  const deleteFolder = (folderId) => {
    setFolders((oldState) => {
      const newState = { ...oldState };
      delete newState[folderId];
      return newState;
    });
  };

  const addFolder = (folderName) => {
    setFolders((oldState) => {
      const newState = { ...oldState };

      newState[uuid()] = {
        title: folderName,
        playgrounds: {},
      };

      return newState;
    });
  };

  const addPlayground = (folderId, playgroundName, language) => {
    setFolders((oldState) => {
      const newState = { ...oldState };

      newState[folderId].playgrounds[uuid()] = {
        title: playgroundName,
        language: language,
        code: languageMap[language].defaultCode,
      };

      return newState;
    });
  };

  const addPlaygroundAndFolder = (folderName, playgroundName, cardLanguage) => {
    setFolders((oldState) => {
      const newState = { ...oldState };

      newState[uuid()] = {
        title: folderName,
        playgrounds: {
          [uuid()]: {
            title: playgroundName,
            language: cardLanguage,
            code: languageMap[cardLanguage].defaultCode,
          },
        },
      };

      return newState;
    });
  };

  const editFolderTitle = (folderId, folderName) => {
    setFolders((oldState) => {
      const newState = { ...oldState };
      newState[folderId].title = folderName;
      return newState;
    });
  };

  const editPlaygroundTitle = (folderId, cardId, PlaygroundTitle) => {
    setFolders((oldState) => {
      const newState = { ...oldState };
      newState[folderId].playgrounds[cardId].title = PlaygroundTitle;
      return newState;
    });
  };

  const savePlayground = (folderId, cardId, newCode, newLanguage) => {
    setFolders((oldState) => {
      const newState = { ...oldState };
      newState[folderId].playgrounds[cardId].code = newCode;
      newState[folderId].playgrounds[cardId].language = newLanguage;
      return newState;
    });
  };

  const PlayGroundFeatures = {
    folders: folders,
    deleteCard: deleteCard,
    deleteFolder: deleteFolder,
    addFolder: addFolder,
    addPlayground: addPlayground,
    addPlaygroundAndFolder: addPlaygroundAndFolder,
    editFolderTitle: editFolderTitle,
    editPlaygroundTitle: editPlaygroundTitle,
    savePlayground: savePlayground,
  };

  return (
    <PlaygroundContext.Provider value={PlayGroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export default PlaygroundProvider;
