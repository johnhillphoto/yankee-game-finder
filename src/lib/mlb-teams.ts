export interface MlbTeam {
  id: number;
  name: string;
  shortName: string;
  abbreviation: string;
  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  secondaryColor: string;
}

export interface Division {
  name: string;
  teams: MlbTeam[];
}

const MLB_TEAMS_LIST: MlbTeam[] = [
  // AL East
  {
    id: 147,
    name: "New York Yankees",
    shortName: "NY Yankees",
    abbreviation: "NYY",
    primaryColor: "#0c2340",
    primaryLight: "#1a3a5c",
    primaryDark: "#071729",
    secondaryColor: "#c4a862",
  },
  {
    id: 111,
    name: "Boston Red Sox",
    shortName: "Boston",
    abbreviation: "BOS",
    primaryColor: "#bd3039",
    primaryLight: "#d03040",
    primaryDark: "#9b1e26",
    secondaryColor: "#0d2b56",
  },
  {
    id: 139,
    name: "Tampa Bay Rays",
    shortName: "Tampa Bay",
    abbreviation: "TB",
    primaryColor: "#092c5c",
    primaryLight: "#1a4580",
    primaryDark: "#061d3d",
    secondaryColor: "#8fbce6",
  },
  {
    id: 141,
    name: "Toronto Blue Jays",
    shortName: "Toronto",
    abbreviation: "TOR",
    primaryColor: "#134a8e",
    primaryLight: "#1c6fc0",
    primaryDark: "#0d3366",
    secondaryColor: "#e8291c",
  },
  {
    id: 110,
    name: "Baltimore Orioles",
    shortName: "Baltimore",
    abbreviation: "BAL",
    primaryColor: "#df4601",
    primaryLight: "#f05010",
    primaryDark: "#b33800",
    secondaryColor: "#000000",
  },
  // AL Central
  {
    id: 145,
    name: "Chicago White Sox",
    shortName: "Chi. White Sox",
    abbreviation: "CWS",
    primaryColor: "#27251f",
    primaryLight: "#3a3830",
    primaryDark: "#1a1814",
    secondaryColor: "#c4cdd6",
  },
  {
    id: 114,
    name: "Cleveland Guardians",
    shortName: "Cleveland",
    abbreviation: "CLE",
    primaryColor: "#00385d",
    primaryLight: "#005080",
    primaryDark: "#00253e",
    secondaryColor: "#e31937",
  },
  {
    id: 116,
    name: "Detroit Tigers",
    shortName: "Detroit",
    abbreviation: "DET",
    primaryColor: "#0c2340",
    primaryLight: "#1a3a5c",
    primaryDark: "#071729",
    secondaryColor: "#fa4616",
  },
  {
    id: 118,
    name: "Kansas City Royals",
    shortName: "Kansas City",
    abbreviation: "KC",
    primaryColor: "#004687",
    primaryLight: "#005fa8",
    primaryDark: "#003068",
    secondaryColor: "#bd9b60",
  },
  {
    id: 142,
    name: "Minnesota Twins",
    shortName: "Minnesota",
    abbreviation: "MIN",
    primaryColor: "#002b5c",
    primaryLight: "#003d80",
    primaryDark: "#001d3e",
    secondaryColor: "#d31145",
  },
  // AL West
  {
    id: 117,
    name: "Houston Astros",
    shortName: "Houston",
    abbreviation: "HOU",
    primaryColor: "#002d62",
    primaryLight: "#003d80",
    primaryDark: "#001e42",
    secondaryColor: "#eb6e1f",
  },
  {
    id: 108,
    name: "Los Angeles Angels",
    shortName: "LA Angels",
    abbreviation: "LAA",
    primaryColor: "#ba0021",
    primaryLight: "#d4002a",
    primaryDark: "#8a0018",
    secondaryColor: "#003263",
  },
  {
    id: 133,
    name: "Oakland Athletics",
    shortName: "Oakland",
    abbreviation: "OAK",
    primaryColor: "#003831",
    primaryLight: "#004d42",
    primaryDark: "#002520",
    secondaryColor: "#efb21e",
  },
  {
    id: 136,
    name: "Seattle Mariners",
    shortName: "Seattle",
    abbreviation: "SEA",
    primaryColor: "#0c2c56",
    primaryLight: "#1a4070",
    primaryDark: "#081e3a",
    secondaryColor: "#005c5c",
  },
  {
    id: 140,
    name: "Texas Rangers",
    shortName: "Texas",
    abbreviation: "TEX",
    primaryColor: "#003278",
    primaryLight: "#004099",
    primaryDark: "#002055",
    secondaryColor: "#c0111f",
  },
  // NL East
  {
    id: 121,
    name: "New York Mets",
    shortName: "NY Mets",
    abbreviation: "NYM",
    primaryColor: "#002d72",
    primaryLight: "#0040a0",
    primaryDark: "#001e4e",
    secondaryColor: "#ff5910",
  },
  {
    id: 143,
    name: "Philadelphia Phillies",
    shortName: "Philadelphia",
    abbreviation: "PHI",
    primaryColor: "#e81828",
    primaryLight: "#f02030",
    primaryDark: "#b81020",
    secondaryColor: "#002d72",
  },
  {
    id: 146,
    name: "Miami Marlins",
    shortName: "Miami",
    abbreviation: "MIA",
    primaryColor: "#00a3e0",
    primaryLight: "#10b5f2",
    primaryDark: "#0080b0",
    secondaryColor: "#ff6600",
  },
  {
    id: 144,
    name: "Atlanta Braves",
    shortName: "Atlanta",
    abbreviation: "ATL",
    primaryColor: "#13274f",
    primaryLight: "#1e3a72",
    primaryDark: "#0d1c38",
    secondaryColor: "#ce1141",
  },
  {
    id: 120,
    name: "Washington Nationals",
    shortName: "Washington",
    abbreviation: "WSH",
    primaryColor: "#ab0003",
    primaryLight: "#c50004",
    primaryDark: "#800002",
    secondaryColor: "#14225a",
  },
  // NL Central
  {
    id: 112,
    name: "Chicago Cubs",
    shortName: "Chi. Cubs",
    abbreviation: "CHC",
    primaryColor: "#0e3386",
    primaryLight: "#1a48a8",
    primaryDark: "#0a2462",
    secondaryColor: "#cc3433",
  },
  {
    id: 113,
    name: "Cincinnati Reds",
    shortName: "Cincinnati",
    abbreviation: "CIN",
    primaryColor: "#c6011f",
    primaryLight: "#d80020",
    primaryDark: "#9e0018",
    secondaryColor: "#000000",
  },
  {
    id: 158,
    name: "Milwaukee Brewers",
    shortName: "Milwaukee",
    abbreviation: "MIL",
    primaryColor: "#12284b",
    primaryLight: "#1c3d70",
    primaryDark: "#0d1c36",
    secondaryColor: "#ffc52f",
  },
  {
    id: 134,
    name: "Pittsburgh Pirates",
    shortName: "Pittsburgh",
    abbreviation: "PIT",
    primaryColor: "#27251f",
    primaryLight: "#3a3830",
    primaryDark: "#1a1814",
    secondaryColor: "#fdb827",
  },
  {
    id: 138,
    name: "St. Louis Cardinals",
    shortName: "St. Louis",
    abbreviation: "STL",
    primaryColor: "#c41e3a",
    primaryLight: "#d42040",
    primaryDark: "#9e1830",
    secondaryColor: "#0c2340",
  },
  // NL West
  {
    id: 109,
    name: "Arizona Diamondbacks",
    shortName: "Arizona",
    abbreviation: "ARI",
    primaryColor: "#a71930",
    primaryLight: "#c02040",
    primaryDark: "#800015",
    secondaryColor: "#e3d4ad",
  },
  {
    id: 115,
    name: "Colorado Rockies",
    shortName: "Colorado",
    abbreviation: "COL",
    primaryColor: "#333366",
    primaryLight: "#484880",
    primaryDark: "#222244",
    secondaryColor: "#c4cdd6",
  },
  {
    id: 119,
    name: "Los Angeles Dodgers",
    shortName: "LA Dodgers",
    abbreviation: "LAD",
    primaryColor: "#005a9c",
    primaryLight: "#006db8",
    primaryDark: "#003d6a",
    secondaryColor: "#ef3e42",
  },
  {
    id: 135,
    name: "San Diego Padres",
    shortName: "San Diego",
    abbreviation: "SD",
    primaryColor: "#2f241d",
    primaryLight: "#453628",
    primaryDark: "#1e1712",
    secondaryColor: "#ffc425",
  },
  {
    id: 137,
    name: "San Francisco Giants",
    shortName: "San Francisco",
    abbreviation: "SF",
    primaryColor: "#27251f",
    primaryLight: "#3a3830",
    primaryDark: "#1a1814",
    secondaryColor: "#fd5a1e",
  },
];

export const DIVISIONS: Division[] = [
  {
    name: "AL East",
    teams: MLB_TEAMS_LIST.filter((t) =>
      [147, 111, 139, 141, 110].includes(t.id)
    ),
  },
  {
    name: "AL Central",
    teams: MLB_TEAMS_LIST.filter((t) =>
      [145, 114, 116, 118, 142].includes(t.id)
    ),
  },
  {
    name: "AL West",
    teams: MLB_TEAMS_LIST.filter((t) =>
      [117, 108, 133, 136, 140].includes(t.id)
    ),
  },
  {
    name: "NL East",
    teams: MLB_TEAMS_LIST.filter((t) =>
      [121, 143, 146, 144, 120].includes(t.id)
    ),
  },
  {
    name: "NL Central",
    teams: MLB_TEAMS_LIST.filter((t) =>
      [112, 113, 158, 134, 138].includes(t.id)
    ),
  },
  {
    name: "NL West",
    teams: MLB_TEAMS_LIST.filter((t) =>
      [109, 115, 119, 135, 137].includes(t.id)
    ),
  },
];

export const DEFAULT_TEAM_ID = 147; // NY Yankees

export function getTeamById(id: number): MlbTeam | undefined {
  return MLB_TEAMS_LIST.find((t) => t.id === id);
}

export const MLB_TEAMS = MLB_TEAMS_LIST;
