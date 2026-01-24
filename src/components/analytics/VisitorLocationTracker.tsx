"use client";

import { Card } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface LocationData {
  country: string;
  count: number;
  percentage: number;
}

interface VisitorLocationTrackerProps {
  locationStats: LocationData[];
}

const COUNTRY_CODE_TO_COORDS: Record<string, { x: number; y: number }> = {
  "AD": { x: 312, y: 138 },
  "AE": { x: 435, y: 228 },
  "AF": { x: 515, y: 198 },
  "AG": { x: 288, y: 288 },
  "AI": { x: 285, y: 285 },
  "AL": { x: 363, y: 145 },
  "AM": { x: 410, y: 162 },
  "AO": { x: 340, y: 385 },
  "AR": { x: 275, y: 535 },
  "AS": { x: 60, y: 320 },
  "AT": { x: 345, y: 128 },
  "AU": { x: 840, y: 495 },
  "AW": { x: 288, y: 298 },
  "AX": { x: 348, y: 65 },
  "AZ": { x: 418, y: 162 },
  "BA": { x: 353, y: 138 },
  "BB": { x: 295, y: 298 },
  "BD": { x: 568, y: 255 },
  "BE": { x: 325, y: 118 },
  "BF": { x: 312, y: 295 },
  "BG": { x: 378, y: 138 },
  "BH": { x: 432, y: 235 },
  "BI": { x: 448, y: 308 },
  "BJ": { x: 315, y: 308 },
  "BL": { x: 268, y: 292 },
  "BM": { x: 268, y: 188 },
  "BN": { x: 725, y: 318 },
  "BO": { x: 258, y: 395 },
  "BQ": { x: 285, y: 315 },
  "BR": { x: 305, y: 345 },
  "BS": { x: 272, y: 258 },
  "BT": { x: 568, y: 245 },
  "BV": { x: 0, y: 0 },
  "BW": { x: 405, y: 415 },
  "BY": { x: 378, y: 95 },
  "BZ": { x: 198, y: 275 },
  "CA": { x: 185, y: 115 },
  "CC": { x: 735, y: 348 },
  "CD": { x: 378, y: 355 },
  "CF": { x: 365, y: 305 },
  "CG": { x: 358, y: 338 },
  "CH": { x: 335, y: 133 },
  "CI": { x: 318, y: 325 },
  "CK": { x: 0, y: 0 },
  "CL": { x: 265, y: 495 },
  "CM": { x: 345, y: 305 },
  "CN": { x: 680, y: 175 },
  "CO": { x: 235, y: 310 },
  "CR": { x: 185, y: 275 },
  "CU": { x: 248, y: 260 },
  "CV": { x: 268, y: 305 },
  "CW": { x: 285, y: 305 },
  "CX": { x: 785, y: 338 },
  "CY": { x: 405, y: 178 },
  "CZ": { x: 348, y: 118 },
  "DE": { x: 338, y: 115 },
  "DJ": { x: 435, y: 278 },
  "DK": { x: 340, y: 98 },
  "DM": { x: 275, y: 282 },
  "DO": { x: 272, y: 268 },
  "DZ": { x: 318, y: 210 },
  "EC": { x: 210, y: 335 },
  "EE": { x: 348, y: 80 },
  "EG": { x: 380, y: 225 },
  "EH": { x: 298, y: 228 },
  "ER": { x: 448, y: 285 },
  "ES": { x: 315, y: 155 },
  "ET": { x: 448, y: 305 },
  "FI": { x: 368, y: 60 },
  "FJ": { x: 928, y: 425 },
  "FK": { x: 298, y: 558 },
  "FM": { x: 825, y: 265 },
  "FO": { x: 315, y: 82 },
  "FR": { x: 323, y: 128 },
  "GA": { x: 335, y: 325 },
  "GB": { x: 305, y: 120 },
  "GD": { x: 278, y: 298 },
  "GE": { x: 405, y: 158 },
  "GF": { x: 298, y: 355 },
  "GG": { x: 300, y: 115 },
  "GH": { x: 318, y: 305 },
  "GI": { x: 318, y: 158 },
  "GL": { x: 245, y: 58 },
  "GM": { x: 285, y: 285 },
  "GN": { x: 285, y: 295 },
  "GP": { x: 282, y: 298 },
  "GQ": { x: 328, y: 315 },
  "GR": { x: 368, y: 155 },
  "GS": { x: 278, y: 578 },
  "GT": { x: 172, y: 268 },
  "GU": { x: 785, y: 268 },
  "GW": { x: 278, y: 288 },
  "GY": { x: 305, y: 325 },
  "HK": { x: 705, y: 235 },
  "HM": { x: 785, y: 548 },
  "HN": { x: 188, y: 275 },
  "HR": { x: 353, y: 133 },
  "HT": { x: 272, y: 270 },
  "HU": { x: 358, y: 122 },
  "ID": { x: 735, y: 335 },
  "IE": { x: 298, y: 115 },
  "IL": { x: 412, y: 188 },
  "IM": { x: 298, y: 115 },
  "IN": { x: 525, y: 235 },
  "IO": { x: 595, y: 345 },
  "IQ": { x: 418, y: 175 },
  "IR": { x: 445, y: 188 },
  "IS": { x: 308, y: 65 },
  "IT": { x: 338, y: 145 },
  "JE": { x: 298, y: 118 },
  "JM": { x: 258, y: 270 },
  "JO": { x: 412, y: 185 },
  "JP": { x: 775, y: 175 },
  "KE": { x: 420, y: 290 },
  "KG": { x: 545, y: 162 },
  "KH": { x: 678, y: 278 },
  "KI": { x: 845, y: 275 },
  "KM": { x: 455, y: 348 },
  "KN": { x: 288, y: 285 },
  "KP": { x: 760, y: 168 },
  "KR": { x: 745, y: 180 },
  "KW": { x: 422, y: 215 },
  "KY": { x: 258, y: 268 },
  "KZ": { x: 505, y: 115 },
  "LA": { x: 668, y: 268 },
  "LB": { x: 405, y: 178 },
  "LC": { x: 285, y: 288 },
  "LI": { x: 340, y: 125 },
  "LK": { x: 555, y: 285 },
  "LR": { x: 305, y: 298 },
  "LS": { x: 418, y: 445 },
  "LT": { x: 358, y: 95 },
  "LU": { x: 330, y: 120 },
  "LV": { x: 353, y: 88 },
  "LY": { x: 355, y: 215 },
  "MA": { x: 298, y: 195 },
  "MC": { x: 320, y: 145 },
  "MD": { x: 378, y: 128 },
  "ME": { x: 358, y: 142 },
  "MF": { x: 272, y: 295 },
  "MG": { x: 488, y: 438 },
  "MH": { x: 785, y: 235 },
  "MK": { x: 368, y: 140 },
  "ML": { x: 295, y: 275 },
  "MM": { x: 648, y: 260 },
  "MN": { x: 608, y: 110 },
  "MO": { x: 712, y: 238 },
  "MP": { x: 765, y: 258 },
  "MQ": { x: 278, y: 325 },
  "MR": { x: 288, y: 278 },
  "MS": { x: 282, y: 292 },
  "MT": { x: 345, y: 148 },
  "MU": { x: 508, y: 418 },
  "MV": { x: 558, y: 285 },
  "MW": { x: 455, y: 368 },
  "MX": { x: 168, y: 235 },
  "MY": { x: 690, y: 305 },
  "MZ": { x: 438, y: 385 },
  "NA": { x: 385, y: 418 },
  "NC": { x: 868, y: 388 },
  "NE": { x: 335, y: 265 },
  "NF": { x: 865, y: 325 },
  "NG": { x: 325, y: 315 },
  "NI": { x: 188, y: 285 },
  "NL": { x: 330, y: 108 },
  "NO": { x: 340, y: 58 },
  "NP": { x: 545, y: 250 },
  "NR": { x: 808, y: 245 },
  "NU": { x: 845, y: 325 },
  "NZ": { x: 905, y: 535 },
  "OM": { x: 445, y: 235 },
  "PA": { x: 198, y: 280 },
  "PE": { x: 228, y: 360 },
  "PF": { x: 75, y: 415 },
  "PG": { x: 845, y: 368 },
  "PH": { x: 765, y: 285 },
  "PK": { x: 545, y: 220 },
  "PL": { x: 355, y: 110 },
  "PM": { x: 215, y: 135 },
  "PN": { x: 312, y: 575 },
  "PR": { x: 265, y: 275 },
  "PS": { x: 415, y: 185 },
  "PT": { x: 305, y: 165 },
  "PW": { x: 808, y: 218 },
  "PY": { x: 298, y: 430 },
  "QA": { x: 432, y: 232 },
  "RE": { x: 505, y: 408 },
  "RO": { x: 378, y: 125 },
  "RS": { x: 363, y: 135 },
  "RU": { x: 565, y: 85 },
  "RW": { x: 445, y: 305 },
  "SA": { x: 425, y: 235 },
  "SB": { x: 848, y: 318 },
  "SC": { x: 495, y: 395 },
  "SD": { x: 405, y: 255 },
  "SE": { x: 348, y: 70 },
  "SG": { x: 725, y: 325 },
  "SH": { x: 272, y: 365 },
  "SI": { x: 345, y: 125 },
  "SJ": { x: 345, y: 55 },
  "SK": { x: 363, y: 118 },
  "SL": { x: 295, y: 288 },
  "SM": { x: 338, y: 142 },
  "SN": { x: 285, y: 298 },
  "SO": { x: 475, y: 285 },
  "SR": { x: 298, y: 338 },
  "SS": { x: 415, y: 278 },
  "ST": { x: 325, y: 338 },
  "SV": { x: 178, y: 275 },
  "SX": { x: 282, y: 295 },
  "SY": { x: 405, y: 168 },
  "SZ": { x: 425, y: 425 },
  "TC": { x: 268, y: 255 },
  "TD": { x: 365, y: 268 },
  "TF": { x: 548, y: 518 },
  "TG": { x: 322, y: 315 },
  "TH": { x: 678, y: 275 },
  "TJ": { x: 538, y: 175 },
  "TK": { x: 845, y: 305 },
  "TL": { x: 815, y: 358 },
  "TM": { x: 485, y: 165 },
  "TN": { x: 338, y: 185 },
  "TO": { x: 855, y: 388 },
  "TR": { x: 385, y: 155 },
  "TT": { x: 272, y: 318 },
  "TV": { x: 805, y: 285 },
  "TW": { x: 755, y: 238 },
  "TZ": { x: 455, y: 345 },
  "UA": { x: 385, y: 105 },
  "UG": { x: 445, y: 298 },
  "UM": { x: 55, y: 268 },
  "US": { x: 220, y: 180 },
  "UY": { x: 305, y: 515 },
  "UZ": { x: 525, y: 165 },
  "VA": { x: 340, y: 148 },
  "VC": { x: 278, y: 292 },
  "VE": { x: 248, y: 305 },
  "VG": { x: 268, y: 268 },
  "VI": { x: 268, y: 265 },
  "VN": { x: 705, y: 275 },
  "VU": { x: 868, y: 365 },
  "WF": { x: 855, y: 435 },
  "WS": { x: 835, y: 358 },
  "YE": { x: 455, y: 258 },
  "YT": { x: 495, y: 412 },
  "ZA": { x: 385, y: 485 },
  "ZM": { x: 420, y: 395 },
  "ZW": { x: 425, y: 435 },
};

const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  "US": "United States",
  "GB": "United Kingdom",
  "IN": "India",
  "CA": "Canada",
  "AU": "Australia",
  "DE": "Germany",
  "FR": "France",
  "BR": "Brazil",
  "JP": "Japan",
  "KR": "South Korea",
  "CN": "China",
  "RU": "Russia",
  "MX": "Mexico",
  "ZA": "South Africa",
  "NL": "Netherlands",
  "IT": "Italy",
  "ES": "Spain",
  "PL": "Poland",
  "SE": "Sweden",
  "NO": "Norway",
  "FI": "Finland",
  "CH": "Switzerland",
  "AT": "Austria",
  "BE": "Belgium",
  "DK": "Denmark",
  "IE": "Ireland",
  "PT": "Portugal",
  "GR": "Greece",
  "TR": "Turkey",
  "EG": "Egypt",
  "NG": "Nigeria",
  "KE": "Kenya",
  "AR": "Argentina",
  "CL": "Chile",
  "CO": "Colombia",
  "PE": "Peru",
  "VE": "Venezuela",
  "EC": "Ecuador",
  "BO": "Bolivia",
  "PY": "Paraguay",
  "UY": "Uruguay",
  "CR": "Costa Rica",
  "PA": "Panama",
  "PR": "Puerto Rico",
  "CU": "Cuba",
  "JM": "Jamaica",
  "HT": "Haiti",
  "DO": "Dominican Republic",
  "GT": "Guatemala",
  "HN": "Honduras",
  "SV": "El Salvador",
  "NI": "Nicaragua",
  "NZ": "New Zealand",
  "SG": "Singapore",
  "MY": "Malaysia",
  "ID": "Indonesia",
  "TH": "Thailand",
  "VN": "Vietnam",
  "PH": "Philippines",
  "PK": "Pakistan",
  "BD": "Bangladesh",
  "LK": "Sri Lanka",
  "NP": "Nepal",
  "MM": "Myanmar",
  "KH": "Cambodia",
  "LA": "Laos",
  "UA": "Ukraine",
  "RO": "Romania",
  "BG": "Bulgaria",
  "HU": "Hungary",
  "CZ": "Czech Republic",
  "SK": "Slovakia",
  "HR": "Croatia",
  "RS": "Serbia",
  "BA": "Bosnia and Herzegovina",
  "AL": "Albania",
  "MK": "North Macedonia",
  "ME": "Montenegro",
  "SI": "Slovenia",
  "LT": "Lithuania",
  "LV": "Latvia",
  "EE": "Estonia",
  "BY": "Belarus",
  "MD": "Moldova",
  "GE": "Georgia",
  "AM": "Armenia",
  "AZ": "Azerbaijan",
  "KZ": "Kazakhstan",
  "UZ": "Uzbekistan",
  "TM": "Turkmenistan",
  "TJ": "Tajikistan",
  "KG": "Kyrgyzstan",
  "AF": "Afghanistan",
  "IR": "Iran",
  "IQ": "Iraq",
  "SY": "Syria",
  "JO": "Jordan",
  "LB": "Lebanon",
  "IL": "Israel",
  "SA": "Saudi Arabia",
  "YE": "Yemen",
  "OM": "Oman",
  "AE": "United Arab Emirates",
  "QA": "Qatar",
  "KW": "Kuwait",
  "BH": "Bahrain",
  "MA": "Morocco",
  "DZ": "Algeria",
  "TN": "Tunisia",
  "LY": "Libya",
  "SD": "Sudan",
  "ET": "Ethiopia",
  "TZ": "Tanzania",
  "UG": "Uganda",
  "RW": "Rwanda",
  "BI": "Burundi",
  "CD": "Democratic Republic of the Congo",
  "GH": "Ghana",
  "CI": "Ivory Coast",
  "SN": "Senegal",
  "ML": "Mali",
  "BF": "Burkina Faso",
  "NE": "Niger",
  "TD": "Chad",
  "CM": "Cameroon",
  "SO": "Somalia",
  "ZW": "Zimbabwe",
  "ZM": "Zambia",
  "MW": "Malawi",
  "MZ": "Mozambique",
  "BW": "Botswana",
  "NA": "Namibia",
  "AO": "Angola",
  "MG": "Madagascar",
  "MN": "Mongolia",
  "KP": "North Korea",
  "TW": "Taiwan",
  "HK": "Hong Kong",
  "MO": "Macau",
  "BN": "Brunei",
  "TL": "Timor-Leste",
  "FJ": "Fiji",
  "PG": "Papua New Guinea",
};

export default function VisitorLocationTracker({ locationStats }: VisitorLocationTrackerProps) {
  const topCountries = locationStats.slice(0, 5);
  const othersCount = locationStats.slice(5).reduce((sum, loc) => sum + loc.count, 0);
  const othersPercentage = locationStats.slice(5).reduce((sum, loc) => sum + loc.percentage, 0);

  const chartData = [
    ...topCountries.map(loc => ({
      name: loc.country.length > 15 ? loc.country.substring(0, 15) + '...' : loc.country,
      fullName: loc.country,
      count: loc.count,
      percentage: loc.percentage
    })),
    ...(othersCount > 0 ? [{
      name: 'Others',
      fullName: 'Others',
      count: othersCount,
      percentage: othersPercentage
    }] : [])
  ];

  const totalVisitors = locationStats.reduce((sum, loc) => sum + loc.count, 0);

  const getCountryCode = (countryName: string): string | null => {
    const entry = Object.entries(COUNTRY_CODE_TO_NAME).find(([_, name]) => name === countryName);
    return entry ? entry[0] : null;
  };

  return (
    <Card className="p-6 bg-[#111827] border border-[#1F2937] bg-gradient-to-br from-[#111827] via-[#0D1117] to-black/40">
      <h3 className="text-[#E6EDF3] font-semibold mb-4 flex items-center">
        <span className="w-1 h-5 bg-purple-500 rounded-sm mr-3 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
        Visitors
        <span className="ml-auto text-xs text-[#9CA3AF] font-normal">{totalVisitors} visitors</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <svg viewBox="0 0 1009.6727 665.96301" className="w-full h-auto" style={{ maxHeight: '320px' }}>
            <defs>
              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="1009.6727" height="665.96301" fill="url(#oceanGradient)" rx="8" />
            <image href="/world.svg" x="0" y="0" width="1009.6727" height="665.96301" preserveAspectRatio="xMidYMid meet" opacity="0.3" />

            {locationStats.map((loc, index) => {
              const countryCode = getCountryCode(loc.country);
              if (!countryCode) return null;

              const coords = COUNTRY_CODE_TO_COORDS[countryCode];
              if (!coords) return null;

              const hue = 270 - (index * 30);
              const color = `hsl(${hue}, 80%, 60%)`;
              const size = Math.min(5 + Math.log2(loc.count) * 1.5, 12);

              return (
                <g key={loc.country}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={size}
                    fill={color}
                    opacity="0.7"
                    filter="url(#glow)"
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={size / 2.5}
                    fill={color}
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col">
          <ResponsiveContainer width="100%" height={315}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, left: 80, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                stroke="#4B5563"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#4B5563"
                tick={{ fontSize: 11, fill: '#E6EDF3' }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#E6EDF3', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ fill: '#374151', opacity: 0.3 }}
                formatter={(value: number | undefined, name: string | undefined, props: any) => [
                  value !== undefined ? `${value} visitors (${props.payload.percentage}%)` : '',
                  props.payload.fullName
                ]}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
