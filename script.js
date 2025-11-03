const startDate = new Date('2025-11-04');


const runVariations = [
{text: 'Easy Run — 6–8 km @ 5:20–5:40/km', class: 'workout-easy'},
{text: 'Steady Run — 8–10 km @ 4:50–5:10/km', class: 'workout-steady'},
{text: 'Tempo Run — 6–8 km with last 2 km @ 4:20–4:30/km', class: 'workout-tempo'},
{text: 'Intervals — 5×1 km @ 3:55–4:05/km (500m jog recoveries)', class: 'workout-interval'},
{text: 'Fartlek — 8 km alternating 1 min fast / 2 min easy @ 4:15–4:30/km', class: 'workout-tempo'},
{text: 'Hill Repeats — 6×200m hill @ hard effort, jog back', class: 'workout-interval'},
{text: 'Progressive Long Run — first half easy, second half increasing pace toward marathon pace @ 4:15/km', class: 'workout-marathon'}
];


const strengthMobilityVariants = [
`<ul class="exercise-list"><li>Plank: 3×45 sec</li><li>Side Plank: 3×30 sec each side</li><li>Glute Bridges: 3×12 reps</li><li>Walking Lunges: 3×12 reps per leg</li><li>Hip Flexor Stretch: 2×30 sec per side</li><li>Foam Roller Quads/Hamstrings/Calves: 5 min total</li></ul>`,
`<ul class="exercise-list"><li>Single-Leg Deadlift: 3×10 per leg</li><li>Goblet Squats: 3×12 reps</li><li>Monster Walks with Band: 2×12 steps each direction</li><li>Thoracic Rotation: 2×10 per side</li><li>Hip Circles & Leg Swings: 2×10 per leg</li><li>Calf Raises: 3×15 reps</li></ul>`,
`<ul class="exercise-list"><li>Push-Ups: 3×12</li><li>Bent-Over Rows: 3×12</li><li>Side-Lying Leg Lifts: 3×15 per side</li><li>Russian Twists: 3×20</li><li>Hip Flexor Stretch: 2×30 sec per side</li><li>Foam Roller Glutes/Hamstrings: 5 min total</li></ul>`
];


function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function formatDate(d) { return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }


const weeks = [];
for (let w = 1; w <= 25; w++) {
const start = addDays(startDate, (w - 1) * 7);
const label = `Week ${w} — ${formatDate(start)}`;
const phase = w <= 6 ? 'Base' : w <= 14 ? 'Build' : w <= 21 ? 'Peak' : 'Taper';
const recovery = w % 3 === 0 && w < 20;
const longRunKm = w <= 6 ? 20 + w : w <= 14 ? 27 + (w - 7) * 1.2 : w <= 21 ? 32 + (w - 14) * 0.8 : [28, 20, 12, 8][w - 22];
const strengthVariant = strengthMobilityVariants[w % strengthMobilityVariants.length];
weeks.push({ label, phase, recovery, longRunKm, strengthVariant });
}


const container = document.getElementById('weeksContainer');
weeks.forEach((wk, i) => {
const weekDiv = document.createElement('div');
weekDiv.className = 'weekcard';
if (i === 0) weekDiv.classList.add('active');


const days = ['Mon','Wed','Thu','Fri','Sat'];
const workouts = [
{run: runVariations[i % runVariations.length], strength: wk.strengthVariant},
{run: runVariations[(i+1) % runVariations.length]},
{run: {text: `Long Run — ${wk.longRunKm} km, ${runVariations[(i+2) % runVariations.length].text}`, class: 'workout-marathon'}},
{run: runVariations[(i+3) % runVariations.length]},
{run: null, strength: wk.strengthVariant}
];


let rows = '';
days.forEach((day, idx) => {
const id = `week${i}-${day}`;
let content = '';
if(workouts[idx].run) content = `<div class='${workouts[idx].run.class}'>${workouts[idx].run.text}</div>`;
if(workouts[idx].strength) content += workouts[idx].strength;
rows += `<tr><td>${day}</td><td><div class='workout-box'><label><input type='checkbox' data-id='${id}'> ${content}</label></div></td></tr>`;
});


weekDiv.innerHTML = `<div class="weekheader"><div class="weektitle">${wk.label}</div><div class="phase">${wk.phase}${wk.recovery ? ' · Recovery' : ''}</div></div><table><thead><tr><th>Day</th><th>Workout</th></tr></thead><tbody>${rows}</tbody></table>`;
container.appendChild(weekDiv);
});


const weekCards = document.querySelectorAll('.weekcard');
let currentWeek = 0;
function showWeek(index) { if(index<0||index>=weekCards.length) return; currentWeek=index; weekCards.forEach(c=>c.classList.remove('active')); weekCards[index].scrollIntoView({behavior:'smooth',inline:'center'}); weekCards[index].classList.add('active'); }
document.getElementById('nextWeek').onclick=()=>showWeek(currentWeek+1);
document.getElementById('prevWeek').onclick=()=>showWeek(currentWeek-1);
document.getElementById('expandAll').onclick=()=>document.querySelectorAll('details').forEach(d=>d.open=true);
document.getElementById('collapseAll').onclick=()=>document.querySelectorAll('details').forEach(d=>d.open=false);


const checkboxes = document.querySelectorAll('input[type=checkbox]');
checkboxes.forEach(cb=>{ const id=cb.dataset.id; if(localStorage.getItem(id)=='true') cb.checked=true; if(cb.checked) cb.parentElement.classList.add('completed'); cb.addEventListener('change',()=>{ cb.parentElement.classList.toggle('completed',cb.checked); localStorage.setItem(id, cb.checked); });});