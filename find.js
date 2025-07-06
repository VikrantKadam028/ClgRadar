const fs = require("fs");
const readline = require("readline");

// Load cutoff data
const data = JSON.parse(fs.readFileSync("cutoff_cleaned.json", "utf8"));

// Setup CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🎓 College Recommender - Maharashtra DSE CAP Round 1 (2024)");
console.log("------------------------------------------------------------");

rl.question("📛 Enter your category (e.g., GOPEN, GOBC, EWS): ", (categoryInput) => {
  const category = categoryInput.trim().toUpperCase();

  rl.question("📘 Enter course keyword (e.g., Comp, IT, AI): ", (courseInput) => {
    const courseKeyword = courseInput.trim().toLowerCase();

    rl.question("🔍 Do you want to search by 'rank' or 'percentage'? ", (modeInput) => {
      const mode = modeInput.trim().toLowerCase();

      if (mode === "rank") {
        rl.question("🔢 Enter your merit rank: ", (rankInput) => {
          const rank = parseInt(rankInput);
          if (isNaN(rank)) {
            console.log("❌ Invalid rank input.");
            rl.close();
            return;
          }
          recommendColleges({ category, rank, courseKeyword });
        });
      } else if (mode === "percentage") {
        rl.question("📊 Enter your percentage: ", (percentInput) => {
          const percent = parseFloat(percentInput);
          if (isNaN(percent)) {
            console.log("❌ Invalid percentage input.");
            rl.close();
            return;
          }
          recommendColleges({ category, percent, courseKeyword });
        });
      } else {
        console.log("❌ Please type only 'rank' or 'percentage'.");
        rl.close();
      }
    });
  });
});

function recommendColleges({ category, rank = null, percent = null, courseKeyword }) {
  const matches = data.filter(entry => {
    const entryCategory = entry["Category"].toUpperCase();
    const entryRank = parseInt(entry["Cutoff Rank"]);
    const entryPercent = parseFloat(entry["Cutoff %"]);
    const courseName = entry["Course"].toLowerCase();

    return entryCategory === category &&
      courseName.includes(courseKeyword) &&
      (
        (rank !== null && rank <= entryRank) ||
        (percent !== null && percent >= entryPercent)
      );
  });

  const sorted = matches.sort((a, b) => parseInt(a["Cutoff Rank"]) - parseInt(b["Cutoff Rank"]));

  if (sorted.length === 0) {
    console.log("❌ No matching colleges found for your input.");
  } else {
    console.log(`\n🎯 Found ${sorted.length} matching colleges:\n`);
    sorted.slice(0, 15).forEach((entry, i) => {
      console.log(
        `${i + 1}. ${entry["College"]} | ${entry["Course"]} | Code: ${entry["Choice Code"]} | Rank: ${entry["Cutoff Rank"]} | %: ${entry["Cutoff %"]}`
      );
    });
    console.log("\n✅ Showing top 15. You can export full list to CSV if needed.");
  }

  rl.close();
}
