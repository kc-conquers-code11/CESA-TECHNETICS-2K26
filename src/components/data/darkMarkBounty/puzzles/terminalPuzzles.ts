export const TERMINAL_PUZZLES = {
  easy: [
    {
      question: "Which command lists files in a directory?",
      options: ["ls", "cd", "mkdir", "rm"],
      answer: "ls",
      hint: "Short for 'list'",
    },
    {
      question: "Which command changes the current directory?",
      options: ["pwd", "ls", "cd", "mv"],
      answer: "cd",
      hint: "Change Directory",
    },
    {
      question: "Which command creates a new directory?",
      options: ["touch", "mkdir", "rm", "cp"],
      answer: "mkdir",
      hint: "Make Directory",
    },
    {
      question: "Which command displays the current working directory?",
      options: ["ls", "pwd", "cd", "cat"],
      answer: "pwd",
      hint: "Print Working Directory",
    },
  ],
  medium: [
    {
      question: "Which command copies a file from src to dest?",
      options: ["mv src dest", "cp src dest", "ln src dest", "dd src dest"],
      answer: "cp src dest",
      hint: "Copy command",
    },
    {
      question: "Which command shows running processes?",
      options: ["top", "ls -a", "ps aux", "df"],
      answer: "ps aux",
      hint: "Process Status with all users",
    },
    {
      question: "Which command shows disk usage?",
      options: ["du -sh", "df -h", "ls -s", "top"],
      answer: "df -h",
      hint: "Disk Free, human readable",
    },
    {
      question: "Which command finds text in files?",
      options: ["find", "sed", "grep", "awk"],
      answer: "grep",
      hint: "Global Regular Expression Print",
    },
  ],
  hard: [
    {
      question: "Which command finds 'error' in log.txt and sorts the results?",
      options: [
        "grep 'error' log.txt | sort",
        "cat log.txt | find 'error'",
        "sort log.txt | grep",
        "find 'error' log.txt -sort",
      ],
      answer: "grep 'error' log.txt | sort",
      hint: "Pipe output of grep into sort",
    },
    {
      question: "Which command shows the last 20 lines of a file in real time?",
      options: [
        "head -20 file",
        "tail -f -n 20 file",
        "cat -n 20 file",
        "watch file -20",
      ],
      answer: "tail -f -n 20 file",
      hint: "-f follows the file, -n sets line count",
    },
    {
      question: "Which replaces 'foo' with 'bar' in file.txt in-place?",
      options: [
        "sed -i 's/foo/bar/g' file.txt",
        "awk '{gsub(foo,bar)}' file.txt",
        "grep -r foo bar file.txt",
        "tr foo bar file.txt",
      ],
      answer: "sed -i 's/foo/bar/g' file.txt",
      hint: "sed stream editor, -i in-place",
    },
  ],
} as const;
