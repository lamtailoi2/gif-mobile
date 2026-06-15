/**
 * Seed script — tạo exercise_guides collection trên Firestore.
 * Mỗi exercise có guide content riêng dựa trên movement pattern.
 *
 * Cách dùng:
 * 1. Import `seedExerciseGuides()` trong _layout.tsx (tạm thời)
 * 2. Run app → script tự động seed nếu collection rỗng
 * 3. Xoá lệnh gọi sau khi seed xong.
 */

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
} from "firebase/firestore";
import exercisesData from "./exercise-library-export.json";
import type { MuscleSlug } from "@/features/home/types/dashboard";
import type {
  IExerciseGuide,
  IExecutionStep,
  IAlternativeExercise,
  IMistake,
} from "@/features/exercise-guide/types/guide";

const GUIDES_COLLECTION = "exercise_guides";

// ---------------------------------------------------------------------------
// Muscle name helpers (Tiếng Việt)
// ---------------------------------------------------------------------------

const MUSCLE_VI: Record<string, string> = {
  quadriceps: "cơ tứ đầu đùi",
  hamstring: "cơ đùi sau",
  gluteal: "cơ mông",
  chest: "cơ ngực",
  deltoids: "cơ vai",
  biceps: "cơ tay trước",
  triceps: "cơ tay sau",
  abs: "cơ bụng",
  "upper-back": "cơ lưng trên",
  "lower-back": "cơ lưng dưới",
  trapezius: "cơ bẫy",
  calves: "cơ bắp chân",
  forearm: "cơ cẳng tay",
  obliques: "cơ chéo bụng",
  adductors: "cơ khép đùi",
};

const EQP_VI: Record<string, string> = {
  bodyweight: "tự trọng",
  dumbbell: "tạ đơn",
  barbell: "tạ đòn",
  bench: "ghế tập",
  machine: "máy tập",
  "pull-up bar": "xà đơn",
  "weight-plates": "đĩa tạ",
};

function describeMuscles(groups: string[]): string {
  return groups.map((m) => MUSCLE_VI[m] ?? m).join(", ");
}

function describeEquipment(equipment: string[]): string {
  return equipment.map((e) => EQP_VI[e] ?? e).join(", ");
}

// ---------------------------------------------------------------------------
// Movement pattern classification
// ---------------------------------------------------------------------------

type MovementPattern =
  | "squat"
  | "deadlift"
  | "hip_thrust"
  | "bench_press"
  | "incline_press"
  | "fly"
  | "shoulder_press"
  | "barbell_row"
  | "dumbbell_row"
  | "pull_up"
  | "lat_pulldown"
  | "curl"
  | "triceps"
  | "leg_extension"
  | "leg_curl"
  | "leg_press"
  | "calf_raise"
  | "shrug"
  | "box_jump"
  | "squat_jump"
  | "broad_jump"
  | "lateral_bound"
  | "split_jump"
  | "depth_jump"
  | "pike_jump"
  | "tuck_jump"
  | "skater_hop"
  | "star_jump"
  | "power_clean"
  | "dumbbell_snatch"
  | "burpee"
  | "push_up"
  | "clapping_push_up"
  | "plyometric_push_up"
  | "plank"
  | "dumbbell_swing"
  | "dumbbell_thruster"
  | "jumping_jack"
  | "mountain_climber"
  | "bear_crawl"
  | "high_knee"
  | "butt_kick"
  | "plank_jack"
  | "cat_cow"
  | "cobra"
  | "child_pose"
  | "pigeon_pose"
  | "downward_dog"
  | "forward_fold"
  | "seated_twist"
  | "standing_quad_stretch"
  | "standing_hamstring_stretch"
  | "chest_stretch"
  | "butterfly_stretch"
  | "figure_four_stretch"
  | "lateral_raise";

const SLUG_TO_PATTERN: Record<string, MovementPattern> = {
  "barbell-squat": "squat",
  "front-squat": "squat",
  "deadlift": "deadlift",
  "hip-thrust": "hip_thrust",
  "bench-press": "bench_press",
  "incline-dumbbell-press": "incline_press",
  "dumbbell-fly": "fly",
  "dumbbell-shoulder-press": "shoulder_press",
  "lateral-raise": "lateral_raise",
  "barbell-row": "barbell_row",
  "dumbbell-row": "dumbbell_row",
  "pull-up": "pull_up",
  "lat-pulldown": "lat_pulldown",
  "bicep-curl": "curl",
  "hammer-curl": "curl",
  "skull-crusher": "triceps",
  "tricep-pushdown": "triceps",
  "leg-extension": "leg_extension",
  "leg-curl": "leg_curl",
  "leg-press": "leg_press",
  "standing-calf-raise": "calf_raise",
  "dumbbell-shrug": "shrug",
  "box-jump": "box_jump",
  "box-squat-jump": "box_jump",
  "squat-jump": "squat_jump",
  "broad-jump": "broad_jump",
  "lateral-bound": "lateral_bound",
  "split-jump": "split_jump",
  "depth-jump": "depth_jump",
  "pike-jump": "pike_jump",
  "tuck-jump": "tuck_jump",
  "skater-hop": "skater_hop",
  "star-jump": "star_jump",
  "power-clean": "power_clean",
  "dumbbell-snatch": "dumbbell_snatch",
  "burpee": "burpee",
  "push-up": "push_up",
  "clapping-push-up": "clapping_push_up",
  "plyometric-push-up": "plyometric_push_up",
  "plank": "plank",
  "dumbbell-swing": "dumbbell_swing",
  "dumbbell-thruster": "dumbbell_thruster",
  "jumping-jack": "jumping_jack",
  "mountain-climber": "mountain_climber",
  "bear-crawl": "bear_crawl",
  "high-knee": "high_knee",
  "butt-kick": "butt_kick",
  "plank-jack": "plank_jack",
  "cat-cow-stretch": "cat_cow",
  "cobra-pose": "cobra",
  "child-pose": "child_pose",
  "pigeon-pose": "pigeon_pose",
  "downward-dog": "downward_dog",
  "forward-fold": "forward_fold",
  "seated-spinal-twist": "seated_twist",
  "standing-quad-stretch": "standing_quad_stretch",
  "standing-hamstring-stretch": "standing_hamstring_stretch",
  "chest-stretch": "chest_stretch",
  "butterfly-stretch": "butterfly_stretch",
  "figure-four-stretch": "figure_four_stretch",
};

// ---------------------------------------------------------------------------
// Content generators per movement pattern
// ---------------------------------------------------------------------------

type Content = {
  steps: IExecutionStep[];
  mistakes: IMistake[];
};

type Generator = (
  name: string,
  muscles: string[],
  equip: string[],
  difficulty: string,
) => Content;

const PATTERN_GENERATORS: Record<string, Generator> = {
  // ---- SQUAT ----
  squat: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Định vị tạ", description: `Đặt ${describeEquipment(equip)} lên bả vai, hai tay nắm thanh rộng hơn vai. Bả vai kẹp lại, core siết chặt.` },
      { step: 2, title: "Hạ thấp hông", description: `Hít vào, đẩy hông ra sau và hạ xuống như ngồi ghế. Đầu gối hướng theo mũi chân. Lưng giữ thẳng.` },
      { step: 3, title: "Tư thế đáy", description: `Khi đùi song song sàn, dừng lại 1 giây. ${describeMuscles(muscles.slice(0, 1))} và ${describeMuscles(muscles.slice(1, 2))} đang căng tối đa.` },
      { step: 4, title: "Đẩy lên", description: `Thở ra, đẩy gót chân xuống sàn, trở về tư thế đứng. Siết cơ mông ở đỉnh.` },
    ],
    mistakes: [
      { title: "Đầu gối chụm vào trong", description: "Đẩy đầu gối ra ngoài theo hướng mũi chân trong suốt chuyển động.", icon: "priority_high" },
      { title: "Nhấc gót chân", description: "Giữ trọng lượng dồn lên gót chân — không nhấc gót lên.", icon: "priority_high" },
      { title: "Lưng cong", description: "Giữ lưng thẳng và core siết chặt. Tưởng tượng có người kéo ngực bạn về phía trước.", icon: "close" },
    ],
  }),

  // ---- DEADLIFT ----
  deadlift: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Đặt tạ ở vị trí", description: `${describeEquipment(equip)} đặt trên sàn, hai chân rộng bằng hông, mũi chân hướng về trước. Thanh tạ nằm trên mu bàn chân.` },
      { step: 2, title: "Cúi xuống nắm tạ", description: `Cúi hông ra sau, lưng thẳng, vai hơi vượt qua thanh tạ. Hai tay nắm thanh rộng bằng vai.` },
      { step: 3, title: "Kéo tạ lên", description: `Thở ra, đẩy chân xuống sàn, kéo tạ dọc theo ống đồng. Giữ lưng thẳng, siết ${describeMuscles(muscles)}.` },
      { step: 4, title: "Khóa tư thế", description: `Khi đứng thẳng, hông và gối khóa, bả vai kẹp nhẹ. Siết cơ mông.` },
      { step: 5, title: "Hạ tạ có kiểm soát", description: `Đẩy hông ra sau, gập người, hạ tạ xuống sàn với kiểm soát. Không thả tạ rơi.` },
    ],
    mistakes: [
      { title: "Lưng cong", description: "Giữ lưng thẳng tuyệt đối. Cong lưng có thể gây chấn thương cột sống.", icon: "priority_high" },
      { title: "Kéo tạ quá xa chân", description: "Giữ thanh tạ sát ống đồng trong suốt chuyển động.", icon: "priority_high" },
      { title: "Vai vượt quá xa tạ", description: "Khi bắt đầu, vai nên hơi vượt qua thanh tạ, không quá nhiều.", icon: "close" },
    ],
  }),

  // ---- HIP THRUST ----
  hip_thrust: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Chuẩn bị tư thế", description: `Ngồi trên sàn, lưng dựa vào ${describeEquipment(equip)}. Bả vai tựa vào ghế, hai chân co, bàn chân đặt sát mông.` },
      { step: 2, title: "Đặt tạ", description: `Đặt tạ lên hông. Giữ bằng hai tay.` },
      { step: 3, title: "Nâng hông", description: `Thở ra, đẩy hông lên cao, siết ${describeMuscles(muscles)}. Giữ lưng dưới thẳng.` },
      { step: 4, title: "Đỉnh động tác", description: `Khi thân trên song song sàn, dừng 1 giây, siết cơ mông cực đại.` },
      { step: 5, title: "Hạ hông", description: `Hít vào, hạ hông xuống gần sàn, lặp lại. Không để chạm sàn.` },
    ],
    mistakes: [
      { title: "Không siết mông đỉnh", description: "Đẩy hông lên hết biên độ và siết cơ mông 1-2 giây.", icon: "priority_high" },
      { title: "Đẩy lưng quá cao", description: "Không để lưng dưới cong quá mức — lực từ mông, không từ lưng.", icon: "priority_high" },
      { title: "Bàn chân di chuyển", description: "Bàn chân đặt vững trên sàn, không nhấc gót.", icon: "close" },
    ],
  }),

  // ---- BENCH PRESS ----
  bench_press: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Nằm ghế và định vị", description: `Nằm ngửa trên ${describeEquipment(equip.filter(e => e !== "barbell"))}, hai mắt thẳng hàng thanh tạ. Bả vai kẹp lại, ngực mở.` },
      { step: 2, title: "Mở tay cầm tạ", description: `Cầm ${describeEquipment(equip.filter(e => e !== "bench"))} rộng hơn vai, lòng bàn tay hướng ra trước, cổ tay thẳng.` },
      { step: 3, title: "Hạ tạ xuống ngực", description: `Hít vào, hạ ${describeEquipment(equip.filter(e => e !== "bench"))} chậm đến ngang núm vú. Khuỷu tay tạo góc 45° với thân.` },
      { step: 4, title: "Đẩy tạ lên", description: `Thở ra, đẩy tạ lên thẳng, duỗi tay hoàn toàn. Siết ${describeMuscles(muscles)} ở đỉnh.` },
    ],
    mistakes: [
      { title: "Khuỷu tay xòe ngang", description: "Giữ khuỷu tay góc 45°, không xòe ngang 90° gây áp lực vai.", icon: "priority_high" },
      { title: "Nảy tạ lên ngực", description: "Không nảy tạ — hạ và đẩy với kiểm soát hoàn toàn.", icon: "priority_high" },
      { title: "Mông nhấc khỏi ghế", description: "Giữ mông chạm ghế và bàn chân đặt vững trên sàn.", icon: "close" },
    ],
  }),

  // ---- INCLINE PRESS ----
  incline_press: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Chỉnh ghế nghiêng", description: `Ngồi trên ghế nghiêng 30-45°, hai tay cầm ${describeEquipment(equip)} ngang vai.` },
      { step: 2, title: "Vị trí bắt đầu", description: `Đẩy tạ lên trên, tay duỗi thẳng. Bả vai kẹp vào ghế, ngực mở.` },
      { step: 3, title: "Hạ tạ chậm", description: `Hít vào, hạ ${describeEquipment(equip)} xuống phần trên ngực, khuỷu hướng xuống 45°.` },
      { step: 4, title: "Đẩy lên và siết", description: `Thở ra, đẩy tạ lên cao, siết ${describeMuscles(muscles)} ở đỉnh. Đặc biệt chú ý vùng ngực trên.` },
    ],
    mistakes: [
      { title: "Ghế quá nghiêng", description: "Góc nghiêng trên 60° chuyển áp lực lên vai thay vì ngực trên.", icon: "priority_high" },
      { title: "Đẩy tạ lệch", description: "Giữ tạ đối xứng, không để bên cao bên thấp.", icon: "close" },
    ],
  }),

  // ---- FLY ----
  fly: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Nằm ghế", description: `Nằm trên ${describeEquipment(equip.filter(e => e !== "dumbbell"))}, hai tay cầm ${describeEquipment(equip.filter(e => e !== "bench"))} giơ thẳng trên ngực, lòng bàn tay hướng vào nhau.` },
      { step: 2, title: "Mở tay ngang", description: `Hít vào, hạ tạ sang ngang, khuỷu tay hơi cong. Cảm giác căng ngang ${describeMuscles(muscles)}.` },
      { step: 3, title: "Kéo tay về", description: `Thở ra, kéo tạ về vị trí ban đầu như ôm một thân cây. Siết ${describeMuscles(muscles)}.` },
    ],
    mistakes: [
      { title: "Gập khuỷu quá nhiều", description: "Giữ khuỷu hơi cong cố định — gập quá nhiều biến fly thành press.", icon: "priority_high" },
      { title: "Hạ tạ quá thấp", description: "Hạ ngang tầm vai, không thấp hơn vai gây áp lực ổ khớp.", icon: "close" },
    ],
  }),

  // ---- SHOULDER PRESS ----
  shoulder_press: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Cầm tạ ngang vai", description: `Đứng hoặc ngồi, cầm ${describeEquipment(equip)} ngang vai, lòng bàn tay hướng trước. Core siết.` },
      { step: 2, title: "Đẩy tạ lên đầu", description: `Thở ra, đẩy ${describeEquipment(equip)} thẳng lên trên đầu. Hai tay song song.` },
      { step: 3, title: "Hạ tạ có kiểm soát", description: `Hít vào, hạ ${describeEquipment(equip)} về ngang vai. Giữ ngực mở.` },
    ],
    mistakes: [
      { title: "Đẩy tạ ra trước", description: "Đẩy tạ thẳng lên, không ra trước. Tưởng tượng đẩy dọc thân.", icon: "priority_high" },
      { title: "Vai nhấc khi đẩy", description: "Giữ vai thấp, không nhún vai khi đẩy tạ lên.", icon: "close" },
    ],
  }),

  // ---- LATERAL RAISE ----
  lateral_raise: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Cầm tạ đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng vai. Cầm ${describeEquipment(equip)} hai tay xuôi thân, lòng bàn tay hướng vào nhau.` },
      { step: 2, title: "Nâng tạ ngang vai", description: `Thở ra, nâng ${describeEquipment(equip)} sang ngang đến ngang vai. Khuỷu hơi cong, tay song song sàn.` },
      { step: 3, title: "Siết vai", description: `Ở đỉnh, siết ${describeMuscles(muscles)}. Dừng 1 giây, cảm giác căng ở vai.` },
      { step: 4, title: "Hạ tạ chậm", description: `Hít vào, hạ ${describeEquipment(equip)} từ từ về vị trí ban đầu.` },
    ],
    mistakes: [
      { title: "Dùng đà lắc người", description: "Giữ thân cố định — không đẩy hông hay lắc người để nâng tạ.", icon: "priority_high" },
      { title: "Nâng tạ quá cao", description: "Nâng đến ngang vai, không cao hơn gây áp lực ổ khớp.", icon: "priority_high" },
      { title: "Gập khuỷu quá nhiều", description: "Giữ khuỷu hơi cong cố định — không gập tạ thành curl.", icon: "close" },
    ],
  }),

  // ---- BARBELL ROW ----
  barbell_row: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Cầm tạ gập người", description: `Cầm ${describeEquipment(equip)} với tay rộng bằng vai. Gập hông ra sau, lưng thẳng, thân song song 45° so với sàn.` },
      { step: 2, title: "Kéo tạ lên bụng", description: `Thở ra, kéo thanh tạ dọc theo thân lên gần rốn. Khuỷu tay đánh cao.` },
      { step: 3, title: "Siết lưng", description: `Ở đỉnh, siết chặt ${describeMuscles(muscles)} trong 1 giây. Bả vai kẹp lại.` },
      { step: 4, title: "Hạ tạ xuống", description: `Hít vào, duỗi tay, hạ tạ về tư thế ban đầu.` },
    ],
    mistakes: [
      { title: "Lưng cong", description: "Giữ lưng thẳng tuyệt đối. Cong lưng khi mang tạ nặng rất nguy hiểm.", icon: "priority_high" },
      { title: "Dùng đà kéo tạ", description: "Không nảy người — chỉ dùng cơ lưng và tay để kéo.", icon: "priority_high" },
      { title: "Khuỷu tay xòe", description: "Giữ khuỷu sát thân khi kéo, không xòe ngang.", icon: "close" },
    ],
  }),

  // ---- DUMBBELL ROW ----
  dumbbell_row: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Tựa tay vào ghế", description: `Đặt tay trái và đầu gối trái lên ${describeEquipment(equip.filter(e => e !== "dumbbell"))}. Chân phải đặt vững trên sàn.` },
      { step: 2, title: "Cầm tạ", description: `Tay phải cầm ${describeEquipment(equip.filter(e => e !== "bench"))} thẳng xuống, lưng song song sàn.` },
      { step: 3, title: "Kéo tạ lên hông", description: `Thở ra, kéo tạ lên phía hông. Khuỷu sát thân, siết ${describeMuscles(muscles)}.` },
      { step: 4, title: "Hạ tạ kiểm soát", description: `Hít vào, hạ tạ thẳng xuống, duỗi tay hoàn toàn. Không thả rơi.` },
    ],
    mistakes: [
      { title: "Xoay người khi kéo", description: "Giữ thân cố định, không xoay — chỉ kéo bằng tay và lưng.", icon: "priority_high" },
      { title: "Kéo tạ ra sau", description: "Kéo tạ lên hông, không kéo ra sau.", icon: "close" },
    ],
  }),

  // ---- PULL UP ----
  pull_up: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Nắm xà", description: `Nhảy lên nắm xà với hai tay rộng hơn vai, lòng bàn tay hướng ra trước. Treo người, thả lỏng vai.` },
      { step: 2, title: "Siết bả vai", description: `Kéo bả vai xuống và ra sau, chủ động kích hoạt ${describeMuscles(muscles)} trước khi kéo.` },
      { step: 3, title: "Kéo người lên", description: `Thở ra, kéo khuỷu xuống đất, đưa cằm qua xà. Siết ${describeMuscles(muscles)} mạnh.` },
      { step: 4, title: "Hạ người chậm", description: `Hít vào, hạ người xuống với kiểm soát — tay duỗi thẳng ở cuối.` },
    ],
    mistakes: [
      { title: "Vung người lấy đà", description: "Không đạp chân hay vung người — kéo bằng cơ lưng và tay.", icon: "priority_high" },
      { title: "Nhấc vai lên tai", description: "Giữ vai thấp, xa tai — không nhún vai.", icon: "priority_high" },
      { title: "Không duỗi tay hết", description: "Duỗi tay hoàn toàn ở cuối để kích hoạt đủ biên độ.", icon: "close" },
    ],
  }),

  // ---- LAT PULLDOWN ----
  lat_pulldown: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Ngồi vào máy", description: `Ngồi vào ${describeEquipment(equip)}, đùi cố định dưới đệm. Hai tay nắm thanh rộng hơn vai.` },
      { step: 2, title: "Kéo thanh xuống", description: `Thở ra, kéo thanh xuống ngang cằm. Khuỷu tay hướng xuống, siết ${describeMuscles(muscles)}.` },
      { step: 3, title: "Siết và giữ", description: `Khi thanh gần chạm ngực trên, siết bả vai lại trong 1 giây.` },
      { step: 4, title: "Đưa thanh lên", description: `Hít vào, đưa thanh lên chậm, tay duỗi thẳng. Giữ vai thấp.` },
    ],
    mistakes: [
      { title: "Kéo thanh ra sau gáy", description: "Kéo thanh xuống trước ngực, không kéo ra sau gáy.", icon: "priority_high" },
      { title: "Ngả người quá xa", description: "Ngả nhẹ ra sau (10-15°) là đủ, không ngả quá xa.", icon: "close" },
    ],
  }),

  // ---- CURL ----
  curl: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng vai. Cầm ${describeEquipment(equip)} hai tay, lòng bàn tay hướng trước.` },
      { step: 2, title: "Cuốn tạ lên vai", description: `Thở ra, cuốn ${describeEquipment(equip)} lên phía vai. Chỉ di chuyển cẳng tay, khuỷu cố định sát thân.` },
      { step: 3, title: "Siết cơ tay", description: `Ở đỉnh, siết ${describeMuscles(muscles)} mạnh trong 1 giây.` },
      { step: 4, title: "Hạ tạ chậm", description: `Hít vào, hạ ${describeEquipment(equip)} từ từ về vị trí ban đầu. Không thả rơi.` },
    ],
    mistakes: [
      { title: "Vung người hỗ trợ", description: "Giữ thân cố định — không đẩy hông hay lắc người.", icon: "priority_high" },
      { title: "Khuỷu tay di chuyển", description: "Ấn khuỷu sát hông trong suốt bài tập.", icon: "close" },
    ],
  }),

  // ---- TRICEPS ----
  triceps: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Vị trí bắt đầu", description: `Nằm ngửa trên ghế, cầm ${describeEquipment(equip)} duỗi thẳng lên trần. Hai tay song song.` },
      { step: 2, title: "Hạ tạ sau đầu", description: `Hít vào, hạ ${describeEquipment(equip)} xuống sau đầu bằng cách gập khuỷu. Cánh tay trên cố định.` },
      { step: 3, title: "Duỗi tay", description: `Thở ra, duỗi khuỷu và đưa ${describeEquipment(equip)} về vị trí bắt đầu. Siết ${describeMuscles(muscles)}.` },
    ],
    mistakes: [
      { title: "Cánh tay trên xòe", description: "Giữ cánh tay trên cố định và hướng thẳng lên, không để xòe ngang.", icon: "priority_high" },
      { title: "Dùng lưng hỗ trợ", description: "Không đẩy lưng — chỉ dùng cơ tay sau.", icon: "close" },
    ],
  }),

  // ---- LEG EXTENSION ----
  leg_extension: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Ngồi vào máy", description: `Ngồi vào ${describeEquipment(equip)}, lưng tựa vào đệm. Gối gập 90°, mặt sau mắt cá chân đặt trên đệm.` },
      { step: 2, title: "Duỗi chân", description: `Thở ra, duỗi thẳng chân từ từ. Siết ${describeMuscles(muscles)} ở đỉnh.` },
      { step: 3, title: "Hạ chân", description: `Hít vào, hạ chân về vị trí gập 90° có kiểm soát.` },
    ],
    mistakes: [
      { title: "Nảy tạ khi duỗi", description: "Duỗi chân chậm và kiểm soát — không nảy.", icon: "priority_high" },
      { title: "Đẩy lưng vào ghế", description: "Giữ lưng sát ghế, không đẩy để tạo lực.", icon: "close" },
    ],
  }),

  // ---- LEG CURL ----
  leg_curl: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Vào tư thế", description: `Nằm sấp trên ghế ${describeEquipment(equip)}, đệm kẹp sau gót chân.` },
      { step: 2, title: "Gập chân", description: `Thở ra, gập gối, kéo gót về phía mông. Siết ${describeMuscles(muscles)}.` },
      { step: 3, title: "Hạ chân", description: `Hít vào, hạ chân xuống chậm, không thả đột ngột.` },
    ],
    mistakes: [
      { title: "Dùng quá nhiều tạ", description: "Chọn tạ vừa phải — không dùng đà để gập.", icon: "priority_high" },
      { title: "Nhấc hông lên", description: "Giữ hông áp sát ghế trong suốt bài tập.", icon: "close" },
    ],
  }),

  // ---- LEG PRESS ----
  leg_press: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Ngồi vào máy", description: `Ngồi vào ${describeEquipment(equip)}, lưng và mông áp sát vào ghế. Hai chân đặt lên bệ, rộng bằng vai.` },
      { step: 2, title: "Đẩy tạ lên", description: `Thở ra, đẩy bệ lên, duỗi chân gần hết (không khóa gối). Siết ${describeMuscles(muscles)}.` },
      { step: 3, title: "Hạ tạ có kiểm soát", description: `Hít vào, hạ bệ từ từ, gối gập 90°. Giữ lưng sát ghế.` },
    ],
    mistakes: [
      { title: "Khóa gối khi duỗi", description: "Không duỗi thẳng gối hoàn toàn — giữ hơi cong để giữ căng cơ.", icon: "priority_high" },
      { title: "Nhấc lưng khỏi ghế", description: "Giữ mông và lưng áp sát ghế.", icon: "close" },
    ],
  }),

  // ---- CALF RAISE ----
  calf_raise: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Đứng vào máy", description: `Đứng trên bệ ${describeEquipment(equip)}, vai kê dưới đệm. Gót chân thòng ra ngoài bệ.` },
      { step: 2, title: "Nhón gót", description: `Thở ra, nhón gót lên cao nhất có thể. Siết ${describeMuscles(muscles)} ở đỉnh.` },
      { step: 3, title: "Hạ gót", description: `Hít vào, hạ gót thấp hơn bệ để kéo căng ${describeMuscles(muscles)}.` },
    ],
    mistakes: [
      { title: "Dùng đà để nhón", description: "Nhón và hạ chậm, không nảy.", icon: "priority_high" },
      { title: "Biên độ quá nhỏ", description: "Hạ gót thấp hơn mũi bàn chân để đạt đủ biên độ.", icon: "close" },
    ],
  }),

  // ---- SHRUG ----
  shrug: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Cầm tạ đứng thẳng", description: `Đứng thẳng, hai tay cầm ${describeEquipment(equip)} xuôi bên hông, lòng bàn tay hướng vào thân.` },
      { step: 2, title: "Nhún vai", description: `Thở ra, nhún vai lên cao nhất về phía tai. Giữ tay thẳng.` },
      { step: 3, title: "Siết và hạ", description: `Ở đỉnh, siết ${describeMuscles(muscles)} 1 giây. Hít vào, hạ vai xuống từ từ.` },
    ],
    mistakes: [
      { title: "Xoay vai khi nhún", description: "Nhún thẳng lên xuống, không xoay vai ra sau.", icon: "priority_high" },
      { title: "Dùng tay hỗ trợ", description: "Giữ tay thẳng — không gập khuỷu.", icon: "close" },
    ],
  }),

  // ---- BOX JUMP ----
  box_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng trước hộp", description: `Đứng cách hộp khoảng 30-45cm. Hai chân rộng bằng vai, trọng lượng dồn lên nửa bàn chân trước.` },
      { step: 2, title: "Hạ thấp trọng tâm", description: `Hạ hông và gập gối vào tư thế ngồi xổm 1/4. Đưa tay ra sau để lấy đà.` },
      { step: 3, title: "Bật lên hộp", description: `Vung tay mạnh về trước, bật người lên hộp. Tiếp đất mềm bằng nửa bàn chân, gối cong.` },
      { step: 4, title: "Đứng thẳng", description: `Đứng thẳng hoàn toàn trên hộp, siết ${describeMuscles(muscles)}.` },
      { step: 5, title: "Bước xuống", description: `Bước xuống từng chân (không nhảy xuống) và lặp lại.` },
    ],
    mistakes: [
      { title: "Tiếp đất khóa gối", description: "Luôn tiếp đất với gối cong để hấp thụ lực.", icon: "priority_high" },
      { title: "Nhảy quá gần hộp", description: "Nhảy lên trên, không nhảy vào hộp quá gần làm vấp ngã.", icon: "priority_high" },
      { title: "Nhảy xuống đất", description: "Bước xuống từng chân, không nhảy xuống.", icon: "close" },
    ],
  }),

  // ---- SQUAT JUMP ----
  squat_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế squat", description: `Đứng rộng bằng vai, hạ thấp hông vào squat sâu. Đùi song song sàn, tay để trước ngực.` },
      { step: 2, title: "Bật nhảy bùng nổ", description: `Bật mạnh lên cao nhất có thể. Vung tay lên để tạo đà.` },
      { step: 3, title: "Tiếp đất mềm", description: `Tiếp đất bằng nửa bàn chân, gối cong, trở lại tư thế squat.` },
      { step: 4, title: "Lặp lại ngay", description: `Không dừng — tiếp đất và lập tức bật nhảy tiếp.` },
    ],
    mistakes: [
      { title: "Tiếp đất nặng", description: "Tiếp đất nhẹ nhàng, gối cong để hấp thụ lực.", icon: "priority_high" },
      { title: "Không squat sâu", description: "Hạ đủ sâu (đùi song song sàn) để kích hoạt ${describeMuscles(muscles)}.", icon: "close" },
    ],
  }),

  // ---- BROAD JUMP ----
  broad_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế chuẩn bị", description: `Đứng thẳng, hai chân rộng bằng vai. Đưa tay ra trước ngực.` },
      { step: 2, title: "Hạ người lấy đà", description: `Hạ thấp hông, đưa tay ra sau. Cảm giác như lò xo nén.` },
      { step: 3, title: "Bật nhảy xa", description: `Vung tay mạnh về trước và bật người về phía trước xa nhất có thể.` },
      { step: 4, title: "Tiếp đất", description: `Tiếp đất bằng cả bàn chân, gối cong sâu để hấp thụ xung lực. Giữ thăng bằng.` },
    ],
    mistakes: [
      { title: "Nhảy lên cao thay vì xa", description: "Tập trung nhảy xa về trước, không nhảy cao.", icon: "priority_high" },
      { title: "Tiếp đất khóa gối", description: "Gối phải cong để hấp thụ lực, tránh chấn thương.", icon: "priority_high" },
    ],
  }),

  // ---- LATERAL BOUND ----
  lateral_bound: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng một chân", description: `Đứng trên chân phải, gối hơi cong. Chân trái nhấc khỏi sàn.` },
      { step: 2, title: "Bật sang trái", description: `Bật mạnh từ chân phải sang trái càng xa càng tốt. Tiếp đất bằng chân trái.` },
      { step: 3, title: "Giữ thăng bằng", description: `Tiếp đất mềm, gối cong, giữ thăng bằng 1 giây.` },
      { step: 4, title: "Bật ngược lại", description: `Lập tức bật ngược lại sang chân phải.` },
    ],
    mistakes: [
      { title: "Tiếp đất mất kiểm soát", description: "Tiếp đất mềm và có kiểm soát — không loạng choạng.", icon: "priority_high" },
      { title: "Biên độ ngắn", description: "Cố gắng nhảy xa sang bên tối đa.", icon: "close" },
    ],
  }),

  // ---- SPLIT JUMP ----
  split_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế chẻ", description: `Một chân trước một chân sau, gối đều cong 90°.` },
      { step: 2, title: "Bật đổi chân", description: `Bật thẳng lên, đổi chân giữa không trung — chân trước ra sau, chân sau ra trước.` },
      { step: 3, title: "Tiếp đất", description: `Tiếp đất với hai gối đều cong 90°, giữ thăng bằng.` },
    ],
    mistakes: [
      { title: "Không đổi chân hoàn toàn", description: "Đổi vị trí chân rõ rệt trên không.", icon: "priority_high" },
      { title: "Tiếp đất gối trước quá xa", description: "Gối trước không vượt quá mũi chân.", icon: "close" },
    ],
  }),

  // ---- DEPTH JUMP ----
  depth_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng trên bục", description: `Đứng trên bục hoặc hộp cao 30-60cm, mũi chân gần mép.` },
      { step: 2, title: "Rơi xuống", description: `Bước ra khỏi bục (không nhảy lên). Tiếp đất bằng nửa bàn chân.` },
      { step: 3, title: "Bật lên ngay lập tức", description: `Ngay khi tiếp đất, bật lên cao nhất có thể. Giảm thời gian tiếp xúc sàn tối thiểu.` },
    ],
    mistakes: [
      { title: "Nhảy lên từ bục", description: "Bước xuống, không nhảy lên — depth jump tận dụng trọng lực.", icon: "priority_high" },
      { title: "Tiếp xúc sàn quá lâu", description: "Tiếp đất và bật ngay — càng nhanh càng tốt.", icon: "priority_high" },
    ],
  }),

  // ---- PIKE JUMP ----
  pike_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng vai, tay giơ lên trần.` },
      { step: 2, title: "Bật nhảy và gập người", description: `Bật lên, đồng thời đưa tay chạm mũi chân. Giữ chân thẳng, gập hông.` },
      { step: 3, title: "Tiếp đất", description: `Tiếp đất mềm, gối cong, trở lại tư thế đứng.` },
    ],
    mistakes: [
      { title: "Gập gối khi chạm tay", description: "Giữ chân thẳng — gập hông, không gập gối.", icon: "priority_high" },
      { title: "Không đủ độ cao", description: "Bật cao để có đủ thời gian chạm mũi chân.", icon: "close" },
    ],
  }),

  // ---- TUCK JUMP ----
  tuck_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, tay để trước ngực, core siết.` },
      { step: 2, title: "Bật nhảy gập gối", description: `Bật lên cao, đồng thời kéo gối lên ngực. Hai tay đập nhẹ vào đầu gối.` },
      { step: 3, title: "Tiếp đất", description: `Thả chân xuống và tiếp đất mềm bằng nửa bàn chân, gối cong.` },
    ],
    mistakes: [
      { title: "Gập người về trước", description: "Giữ thân thẳng, gập gối lên — không cúi người.", icon: "priority_high" },
      { title: "Không kéo gối cao", description: "Cố gắng kéo gối chạm ngực.", icon: "close" },
    ],
  }),

  // ---- SKATER HOP ----
  skater_hop: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng một chân", description: `Đứng trên chân phải, chân trái bắt chéo ra sau.` },
      { step: 2, title: "Bật sang trái", description: `Bật mạnh sang trái. Chân phải bắt chéo ra sau chân trái khi tiếp đất.` },
      { step: 3, title: "Liên tục", description: `Bật liên tục sang hai bên, nhịp nhàng. Không dừng giữa các lần.` },
    ],
    mistakes: [
      { title: "Tiếp đất nặng", description: "Nhẹ nhàng như lướt trên băng.", icon: "priority_high" },
      { title: "Biên độ quá nhỏ", description: "Bật xa sang bên — không chỉ nhảy tại chỗ.", icon: "close" },
    ],
  }),

  // ---- STAR JUMP ----
  star_jump: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng khép chân", description: `Đứng thẳng, hai chân khép, tay xuôi dọc thân.` },
      { step: 2, title: "Bật mở tay chân", description: `Bật lên, đồng thời dang rộng tay và chân thành hình ngôi sao.` },
      { step: 3, title: "Khép về", description: `Khép tay và chân về tư thế bắt đầu khi tiếp đất.` },
    ],
    mistakes: [
      { title: "Không dang hết biên độ", description: "Dang tay chân rộng hết cỡ trên không.", icon: "priority_high" },
      { title: "Tiếp đất khóa gối", description: "Tiếp đất mềm với gối cong.", icon: "close" },
    ],
  }),

  // ---- POWER CLEAN ----
  power_clean: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Tư thế xuất phát", description: `Đứng gần ${describeEquipment(equip)}, hai chân rộng bằng hông. Cúi xuống nắm thanh tạ rộng hơn vai.` },
      { step: 2, title: "Kéo tạ lên", description: `Kéo tạ từ sàn lên dọc thân, bả vai ngang thanh tạ.` },
      { step: 3, title: "Hít đạp", description: `Khi tạ đến đùi, duỗi thẳng hông, gối, nhún vai và nhón chân bật lên.` },
      { step: 4, title: "Đỡ tạ", description: `Kéo người xuống dưới tạ, đỡ tạ bằng vai trong tư thế squat.` },
      { step: 5, title: "Đứng thẳng", description: `Đứng thẳng, tạ trên vai. Hạ tạ xuống đùi và đặt xuống sàn.` },
    ],
    mistakes: [
      { title: "Kéo tạ bằng tay quá sớm", description: "Kéo tạ bằng chân và hông — tay chỉ để dẫn hướng.", icon: "priority_high" },
      { title: "Không kẹp bả vai", description: "Kẹp bả vai để đỡ tạ an toàn.", icon: "priority_high" },
      { title: "Tạ rơi xa người", description: "Giữ tạ sát thân trong suốt quá trình kéo.", icon: "close" },
    ],
  }),

  // ---- DUMBBELL SNATCH ----
  dumbbell_snatch: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Đặt tạ", description: `${describeEquipment(equip)} đặt trên sàn giữa hai chân. Hạ người xuống, lưng thẳng, một tay nắm tạ.` },
      { step: 2, title: "Kéo và bật", description: `Kéo tạ lên dọc thân, duỗi thẳng hông, gối, nhún vai mạnh để đẩy tạ lên cao.` },
      { step: 3, title: "Đỡ tạ trên đầu", description: `Xoay cổ tay và đưa tay thẳng lên, đỡ tạ trên đầu. Khuỷu khóa, ${describeMuscles(muscles)} siết.` },
      { step: 4, title: "Hạ tạ xuống", description: `Hạ tạ từ từ xuống sàn, chuẩn bị cho lần tiếp theo.` },
    ],
    mistakes: [
      { title: "Kéo tạ xa người", description: "Giữ tạ sát thân khi kéo lên.", icon: "priority_high" },
      { title: "Duỗi tay chậm", description: "Duỗi thẳng tay dứt khoát khi đỡ tạ trên đầu.", icon: "close" },
    ],
  }),

  // ---- BURPEE ----
  burpee: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng vai.` },
      { step: 2, title: "Hạ xuống chống đẩy", description: `Ngồi xổm, chống hai tay xuống sàn, bật chân ra sau vào tư thế chống đẩy.` },
      { step: 3, title: "Chống đẩy", description: `Thực hiện một lần chống đẩy hoàn chỉnh. Ngực chạm sàn, đẩy lên.` },
      { step: 4, title: "Bật chân về", description: `Bật hai chân về phía tay, trở lại tư thế ngồi xổm.` },
      { step: 5, title: "Bật nhảy vỗ tay", description: `Bật lên cao, vỗ tay trên đầu. Kết thúc bằng tư thế đứng.` },
    ],
    mistakes: [
      { title: "Không chống đẩy đủ sâu", description: "Ngực phải chạm sàn hoặc gần sàn.", icon: "priority_high" },
      { title: "Lưng cong khi chống đẩy", description: "Giữ lưng thẳng, core siết trong suốt bài tập.", icon: "priority_high" },
      { title: "Không bật đủ cao", description: "Bật cao và vỗ tay dứt khoát.", icon: "close" },
    ],
  }),

  // ---- PUSH UP ----
  push_up: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế chống đẩy", description: `Chống hai tay rộng hơn vai, thân thẳng từ đầu đến gót chân. Core siết.` },
      { step: 2, title: "Hạ thân xuống", description: `Hít vào, hạ thân xuống, khuỷu tay tạo góc 45° với thân. Ngực gần chạm sàn.` },
      { step: 3, title: "Đẩy lên", description: `Thở ra, đẩy thân lên, duỗi tay hoàn toàn. Siết ${describeMuscles(muscles)} ở đỉnh.` },
    ],
    mistakes: [
      { title: "Lưng võng", description: "Siết core — cơ thể phải là một đường thẳng.", icon: "priority_high" },
      { title: "Khuỷu tay xòe ngang", description: "Giữ khuỷu góc 45°, không xòe 90°.", icon: "priority_high" },
      { title: "Không xuống đủ sâu", description: "Ngực phải cách sàn khoảng 5-10cm.", icon: "close" },
    ],
  }),

  // ---- CLAPPING PUSH UP ----
  clapping_push_up: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế chống đẩy", description: `Vào tư thế chống đẩy cơ bản, thân thẳng, core siết.` },
      { step: 2, title: "Hạ người", description: `Hạ thân xuống như chống đẩy thường.` },
      { step: 3, title: "Đẩy bùng nổ & vỗ tay", description: `Đẩy mạnh lên, bật người khỏi sàn, vỗ tay giữa không trung.` },
      { step: 4, title: "Tiếp đất", description: `Tiếp đất mềm bằng tay, khuỷu cong, lặp lại.` },
    ],
    mistakes: [
      { title: "Không đẩy đủ cao", description: "Đẩy mạnh để có đủ thời gian vỗ tay.", icon: "priority_high" },
      { title: "Tiếp đất bằng tay thẳng", description: "Khuỷu cong khi tiếp đất để hấp thụ lực.", icon: "priority_high" },
    ],
  }),

  // ---- PLYOMETRIC PUSH UP ----
  plyometric_push_up: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế chống đẩy", description: `Vào tư thế chống đẩy, thân thẳng, core siết.` },
      { step: 2, title: "Hạ người sâu", description: `Hạ thân thấp hơn chống đẩy thường để tạo căng cơ tối đa.` },
      { step: 3, title: "Bật lên", description: `Đẩy bùng nổ, bật tay khỏi sàn.` },
      { step: 4, title: "Tiếp đất", description: `Tiếp đất bằng tay, giảm xóc bằng khuỷu. Lặp lại ngay.` },
    ],
    mistakes: [
      { title: "Mất kiểm soát khi bật", description: "Giữ thân thẳng — không xoay người.", icon: "priority_high" },
      { title: "Không đủ lực đẩy", description: "Cần đẩy mạnh để tay rời khỏi sàn.", icon: "close" },
    ],
  }),

  // ---- PLANK ----
  plank: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế tấm ván", description: `Chống hai cẳng tay xuống sàn, khuỷu ngay dưới vai. Thân thẳng từ tai đến gót chân.` },
      { step: 2, title: "Siết toàn thân", description: `Siết ${describeMuscles(muscles)} và core. Kéo rốn về phía cột sống. Giữ thân thẳng.` },
      { step: 3, title: "Giữ nhịp thở", description: `Hít thở đều trong suốt thời gian giữ tư thế. Không nín thở.` },
      { step: 4, title: "Kết thúc", description: `Hạ gối xuống sàn, thả lỏng.` },
    ],
    mistakes: [
      { title: "Đẩy mông lên cao", description: "Giữ hông thẳng hàng với vai và gót chân.", icon: "priority_high" },
      { title: "Sụp lưng dưới", description: "Siết bụng và cơ mông để giữ lưng thẳng.", icon: "priority_high" },
      { title: "Nhìn lên trần", description: "Nhìn xuống sàn, giữ cổ thẳng.", icon: "close" },
    ],
  }),

  // ---- DUMBBELL SWING ----
  dumbbell_swing: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Giữ tạ", description: `Cầm ${describeEquipment(equip)} bằng hai tay, chân rộng hơn vai. Gập hông, lưng thẳng.` },
      { step: 2, title: "Vung tạ ra sau", description: `Đưa ${describeEquipment(equip)} xuống giữa hai chân, gập hông sâu hơn.` },
      { step: 3, title: "Vung tạ lên trước", description: `Bật hông về trước, vung ${describeEquipment(equip)} lên ngang ngực. Siết ${describeMuscles(muscles)}.` },
      { step: 4, title: "Hạ tạ", description: `Hạ ${describeEquipment(equip)} xuống giữa hai chân cho lần vung tiếp theo.` },
    ],
    mistakes: [
      { title: "Dùng tay để vung", description: "Lực từ hông và chân — tay chỉ để giữ tạ.", icon: "priority_high" },
      { title: "Lưng cong", description: "Giữ lưng thẳng, gập hông không gập lưng.", icon: "priority_high" },
    ],
  }),

  // ---- DUMBBELL THRUSTER ----
  dumbbell_thruster: (_name, muscles, equip) => ({
    steps: [
      { step: 1, title: "Giữ tạ ngang vai", description: `Cầm ${describeEquipment(equip)} ngang vai, lòng bàn tay hướng trước. Core siết, ngực mở.` },
      { step: 2, title: "Ngồi xổm", description: `Hạ thấp hông xuống squat, giữ tạ ngang vai.` },
      { step: 3, title: "Đứng lên đẩy tạ", description: `Đứng lên bùng nổ, tận dụng đà để đẩy ${describeEquipment(equip)} thẳng lên đầu.` },
      { step: 4, title: "Hạ tạ về vai", description: `Hạ ${describeEquipment(equip)} về vai và lập tức squat tiếp.` },
    ],
    mistakes: [
      { title: "Mất nhịp giữa squat và press", description: "Kết hợp mượt mà — đứng lên và đẩy tạ là một chuyển động liên tục.", icon: "priority_high" },
      { title: "Đẩy tạ quá sớm", description: "Không đẩy tạ lên trước khi đứng thẳng hẳn.", icon: "close" },
    ],
  }),

  // ---- JUMPING JACK ----
  jumping_jack: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân khép, tay xuôi thân.` },
      { step: 2, title: "Bật mở", description: `Bật nhẹ, mở chân sang ngang rộng hơn vai, đồng thời vung tay lên đến khi hai tay chạm nhau trên đầu.` },
      { step: 3, title: "Bật khép", description: `Bật lại, khép chân, hạ tay xuống. Lặp lại nhịp nhàng.` },
    ],
    mistakes: [
      { title: "Tiếp đất nặng", description: "Nhẹ nhàng — tiếp đất bằng nửa bàn chân, không phải gót.", icon: "priority_high" },
      { title: "Tay không đưa cao", description: "Đưa tay lên hết biên độ, hai tay chạm nhau trên đầu.", icon: "close" },
    ],
  }),

  // ---- MOUNTAIN CLIMBER ----
  mountain_climber: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế chống đẩy", description: `Vào tư thế chống đẩy, thân thẳng từ đầu đến gót.` },
      { step: 2, title: "Kéo gối lên ngực", description: `Kéo gối phải về phía ngực, siết ${describeMuscles(muscles)}. Giữ hông thấp.` },
      { step: 3, title: "Đổi chân", description: `Bật đổi chân — kéo gối trái về, đưa chân phải ra sau. Lặp lại nhanh.` },
    ],
    mistakes: [
      { title: "Hông đẩy lên cao", description: "Giữ hông thấp, không đẩy mông lên khi đổi chân.", icon: "priority_high" },
      { title: "Đổi chân quá chậm", description: "Đổi chân nhanh, nhịp nhàng như đang chạy.", icon: "close" },
    ],
  }),

  // ---- BEAR CRAWL ----
  bear_crawl: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Bò gấu", description: `Chống tay và gối, đầu gối không chạm sàn. Lưng phẳng, core siết.` },
      { step: 2, title: "Bước tay phải", description: `Bước tay phải và chân trái lên phía trước.` },
      { step: 3, title: "Bước tay trái", description: `Bước tay trái và chân phải lên phía trước.` },
      { step: 4, title: "Di chuyển", description: `Tiếp tục 'đi' bằng tay và chân với kiểm soát.` },
    ],
    mistakes: [
      { title: "Bước chân tay cùng bên", description: "Bước chéo — tay phải với chân trái, tay trái với chân phải.", icon: "priority_high" },
      { title: "Đầu gối chạm sàn", description: "Giữ đầu gối lơ lửng, không chạm sàn.", icon: "close" },
    ],
  }),

  // ---- HIGH KNEE ----
  high_knee: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng hông, tay gập trước ngực.` },
      { step: 2, title: "Chạy gối cao", description: `Nâng đầu gối phải lên ngang hông, đồng thời đánh tay trái lên.` },
      { step: 3, title: "Đổi chân nhanh", description: `Hạ chân phải và nâng gối trái lên. Lặp lại luân phiên nhanh.` },
    ],
    mistakes: [
      { title: "Nâng gối không đủ cao", description: "Nâng gối lên ít nhất ngang hông.", icon: "priority_high" },
      { title: "Ngả người ra sau", description: "Giữ thân thẳng, hơi nghiêng về trước một chút.", icon: "close" },
    ],
  }),

  // ---- BUTT KICK ----
  butt_kick: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng hông.` },
      { step: 2, title: "Đạp gót vào mông", description: `Đạp gót chân phải lên chạm mông.` },
      { step: 3, title: "Đổi chân", description: `Hạ chân phải và đạp gót trái lên mông. Luân phiên nhanh.` },
    ],
    mistakes: [
      { title: "Không đạp vào mông", description: "Cố gắng đạp gót chạm mông ở mỗi lần.", icon: "priority_high" },
      { title: "Ngả người ra trước", description: "Giữ thân thẳng, không gập người.", icon: "close" },
    ],
  }),

  // ---- PLANK JACK ----
  plank_jack: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế plank", description: `Vào tư thế plank cao (chống tay thẳng), thân thẳng.` },
      { step: 2, title: "Mở chân", description: `Bật hai chân mở rộng sang ngang — như jumping jack nhưng ở tư thế plank.` },
      { step: 3, title: "Khép chân", description: `Bật hai chân khép lại. Lặp lại nhịp nhàng.` },
    ],
    mistakes: [
      { title: "Đẩy mông lên", description: "Giữ hông thấp, thân thẳng hàng.", icon: "priority_high" },
      { title: "Sụp lưng", description: "Siết core, không để lưng võng.", icon: "priority_high" },
    ],
  }),

  // ---- CAT-COW ----
  cat_cow: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế bàn", description: `Quỳ chống tay, hai tay thẳng dưới vai, hai gối dưới hông. Lưng thẳng.` },
      { step: 2, title: "Cong lưng mèo", description: `Thở ra, cong lưng lên như mèo giận. Cằm hướng xuống ngực, kéo rốn vào.` },
      { step: 3, title: "Võng lưng bò", description: `Hít vào, võng lưng xuống, ngước mắt lên. ${describeMuscles(muscles)} kéo giãn.` },
      { step: 4, title: "Luân chuyển", description: `Chậm rãi luân chuyển giữa hai tư thế theo nhịp thở.` },
    ],
    mistakes: [
      { title: "Cử động đột ngột", description: "Chuyển động chậm, mượt mà theo nhịp thở.", icon: "priority_high" },
      { title: "Gập khuỷu tay", description: "Giữ tay thẳng, khuỷu không khóa.", icon: "close" },
    ],
  }),

  // ---- COBRA ----
  cobra: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Nằm sấp", description: `Nằm sấp trên thảm, hai chân duỗi thẳng. Lòng bàn tay đặt dưới vai, khuỷu sát thân.` },
      { step: 2, title: "Đẩy ngực lên", description: `Hít vào, đẩy nhẹ tay, nâng ngực lên khỏi sàn. Khuỷu hơi cong.` },
      { step: 3, title: "Giữ và thở", description: `Giữ tư thế khi ${describeMuscles(muscles)} kéo giãn. Thở đều, giữ 15-30 giây.` },
      { step: 4, title: "Hạ xuống", description: `Thở ra, hạ ngực từ từ xuống sàn.` },
    ],
    mistakes: [
      { title: "Khóa khuỷu tay", description: "Giữ khuỷu hơi cong — không khóa khớp.", icon: "priority_high" },
      { title: "Nhún vai lên tai", description: "Giữ vai thấp, xa tai.", icon: "close" },
    ],
  }),

  // ---- CHILD POSE ----
  child_pose: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Quỳ trên thảm", description: `Quỳ trên thảm, hai gối rộng bằng vai, hai ngón chân chạm nhau.` },
      { step: 2, title: "Gập người về trước", description: `Thở ra, gập người về trước, trán chạm sàn. Hai tay duỗi thẳng về trước.` },
      { step: 3, title: "Thả lỏng", description: `Thả lỏng toàn thân. ${describeMuscles(muscles)} được kéo giãn nhẹ nhàng. Thở sâu.` },
    ],
    mistakes: [
      { title: "Vai nhấc lên", description: "Thả lỏng vai và tay hoàn toàn.", icon: "priority_high" },
      { title: "Mông không chạm gót", description: "Cố gắng đưa mông chạm gót chân.", icon: "close" },
    ],
  }),

  // ---- PIGEON POSE ----
  pigeon_pose: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế bàn", description: `Quỳ chống tay, lưng thẳng.` },
      { step: 2, title: "Đưa chân lên trước", description: `Đưa chân phải lên trước, gối phải đặt sau cổ tay phải. Cẳng chân chéo trên thảm.` },
      { step: 3, title: "Hạ người xuống", description: `Duỗi chân trái ra sau. Từ từ gập người về trước, chống khuỷu hoặc trán chạm sàn.` },
      { step: 4, title: "Giữ và thả lỏng", description: `Giữ 30-45 giây, thở sâu. ${describeMuscles(muscles)} kéo giãn sâu. Đổi bên.` },
    ],
    mistakes: [
      { title: "Gối chân trước chịu áp lực", description: "Giữ gối trước ở góc thoải mái, không quá 90°.", icon: "priority_high" },
      { title: "Hông nghiêng", description: "Giữ hai hông cân bằng, hướng về trước.", icon: "close" },
    ],
  }),

  // ---- DOWNWARD DOG ----
  downward_dog: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Tư thế bàn", description: `Quỳ chống tay, cổ tay dưới vai, gối dưới hông.` },
      { step: 2, title: "Đẩy hông lên", description: `Thở ra, duỗi thẳng chân, đẩy hông lên cao. Cơ thể tạo hình chữ V ngược.` },
      { step: 3, title: "Ấn gót xuống sàn", description: `Ấn gót chân xuống dần. Hai tai nằm giữa hai cánh tay.` },
      { step: 4, title: "Giữ và thở", description: `Giữ tư thế, thở sâu. ${describeMuscles(muscles)} kéo giãn sâu.` },
    ],
    mistakes: [
      { title: "Lưng cong", description: "Giữ lưng thẳng — kéo rốn vào, đẩy hông lên.", icon: "priority_high" },
      { title: "Đầu gối khóa", description: "Giữ gối hơi cong, không khóa.", icon: "close" },
    ],
  }),

  // ---- FORWARD FOLD ----
  forward_fold: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng hông, tay xuôi thân.` },
      { step: 2, title: "Gập người", description: `Thở ra, gập hông, cúi người về trước. Hai tay chạm sàn hoặc nắm khuỷu tay đối diện.` },
      { step: 3, title: "Thả lỏng đầu và cổ", description: `Thả lỏng hoàn toàn đầu và cổ. ${describeMuscles(muscles)} kéo giãn sâu.` },
      { step: 4, title: "Từ từ đứng lên", description: `Hít vào, từ từ cuộn người lên, đốt sống từng cái một.` },
    ],
    mistakes: [
      { title: "Gập lưng thay vì gập hông", description: "Gập từ hông — giữ lưng thẳng khi cúi.", icon: "priority_high" },
      { title: "Khóa gối", description: "Giữ gối hơi cong, không khóa.", icon: "close" },
    ],
  }),

  // ---- SEATED TWIST ----
  seated_twist: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Ngồi trên thảm", description: `Ngồi trên thảm, hai chân duỗi thẳng về trước.` },
      { step: 2, title: "Gập chân phải", description: `Gập gối phải, đặt bàn chân phải bên ngoài gối trái.` },
      { step: 3, title: "Xoay người", description: `Đặt tay trái ra sau lưng, tay phải chạm đầu gối phải. Xoay người sang phải.` },
      { step: 4, title: "Giữ và thở", description: `Giữ 30 giây, thở sâu. ${describeMuscles(muscles)} kéo giãn. Đổi bên.` },
    ],
    mistakes: [
      { title: "Xoay từ thắt lưng", description: "Xoay từ ngực — giữ hông cố định hướng về trước.", icon: "priority_high" },
      { title: "Cúi người về trước", description: "Giữ lưng thẳng, ngực mở.", icon: "close" },
    ],
  }),

  // ---- STANDING QUAD STRETCH ----
  standing_quad_stretch: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, tựa một tay vào tường nếu cần.` },
      { step: 2, title: "Nắm cổ chân", description: `Gập gối phải, tay phải nắm cổ chân phải, kéo gót về phía mông.` },
      { step: 3, title: "Giữ tư thế", description: `Giữ hai gối sát nhau. Đẩy nhẹ hông về trước. ${describeMuscles(muscles)} kéo giãn.` },
      { step: 4, title: "Đổi chân", description: `Giữ 30 giây, thả ra và đổi bên.` },
    ],
    mistakes: [
      { title: "Gối mở sang ngang", description: "Giữ hai gối sát nhau, không xòe.", icon: "priority_high" },
      { title: "Ngả người ra sau", description: "Giữ thân thẳng, siết core.", icon: "close" },
    ],
  }),

  // ---- STANDING HAMSTRING STRETCH ----
  standing_hamstring_stretch: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng thẳng", description: `Đứng thẳng, hai chân rộng bằng hông.` },
      { step: 2, title: "Đưa chân phải lên", description: `Đặt gót chân phải lên ghế hoặc bục thấp. Chân thẳng.` },
      { step: 3, title: "Gập người về trước", description: `Từ từ gập hông, đưa tay về phía mũi chân phải. Lưng thẳng.` },
      { step: 4, title: "Giữ và đổi bên", description: `Giữ 30 giây, ${describeMuscles(muscles)} kéo giãn. Đổi chân.` },
    ],
    mistakes: [
      { title: "Đầu gối khóa quá cứng", description: "Giữ gối hơi micro-bend, không khóa.", icon: "priority_high" },
      { title: "Cong lưng khi cúi", description: "Gập hông, giữ lưng thẳng.", icon: "close" },
    ],
  }),

  // ---- CHEST STRETCH ----
  chest_stretch: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Đứng cạnh khung cửa", description: `Đứng cạnh khung cửa hoặc cột, tay phải đặt lên khung ngang vai.` },
      { step: 2, title: "Xoay người", description: `Từ từ xoay người sang trái, giữ tay phải cố định. Ngực phải kéo giãn.` },
      { step: 3, title: "Giữ và thở", description: `Giữ 30 giây, thở sâu. ${describeMuscles(muscles)} kéo giãn. Đổi bên.` },
    ],
    mistakes: [
      { title: "Vai nhấc lên", description: "Giữ vai thấp, thả lỏng.", icon: "priority_high" },
      { title: "Xoay quá nhanh", description: "Xoay từ từ, không giật.", icon: "close" },
    ],
  }),

  // ---- BUTTERFLY STRETCH ----
  butterfly_stretch: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Ngồi trên thảm", description: `Ngồi trên thảm, hai lòng bàn chân chạm nhau, gối mở sang ngang.` },
      { step: 2, title: "Giữ chân và đẩy gối", description: `Hai tay nắm giữ ngón chân. Đẩy đầu gối xuống dần về phía sàn.` },
      { step: 3, title: "Gập người nhẹ", description: `Từ từ gập người về trước. ${describeMuscles(muscles)} kéo giãn sâu. Giữ 30-45 giây.` },
    ],
    mistakes: [
      { title: "Gối bật lên khi đẩy", description: "Đẩy gối xuống nhẹ nhàng, không nảy.", icon: "priority_high" },
      { title: "Lưng cong", description: "Giữ lưng thẳng, gập từ hông.", icon: "close" },
    ],
  }),

  // ---- FIGURE FOUR STRETCH ----
  figure_four_stretch: (_name, muscles) => ({
    steps: [
      { step: 1, title: "Nằm ngửa", description: `Nằm ngửa trên thảm, hai gối gập, bàn chân đặt trên sàn.` },
      { step: 2, title: "Bắt chéo chân", description: `Đặt mắt cá chân phải lên đùi trái, gần gối. Tạo hình số 4.` },
      { step: 3, title: "Kéo gối vào ngực", description: `Kéo gối trái về phía ngực. ${describeMuscles(muscles)} kéo giãn.` },
      { step: 4, title: "Giữ và đổi bên", description: `Giữ 30 giây, thở sâu. Đổi bên.` },
    ],
    mistakes: [
      { title: "Cổ chân chịu áp lực", description: "Đặt mắt cá lên đùi, không lên đầu gối.", icon: "priority_high" },
      { title: "Gồng vai", description: "Thả lỏng vai và cổ hoàn toàn.", icon: "close" },
    ],
  }),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DIFFICULTY_MAP = {
  beginner: "beginner" as const,
  intermediate: "intermediate" as const,
  advanced: "advanced" as const,
};

function pickAlternatives(
  exercise: (typeof exercisesData)[0],
  allExercises: (typeof exercisesData),
  count = 2,
): IAlternativeExercise[] {
  const candidates = allExercises.filter((ex) => {
    if (ex.id === exercise.id) return false;
    const shared = ex.muscleGroups.filter((m) =>
      exercise.muscleGroups.includes(m),
    );
    return shared.length > 0;
  });

  const picked = candidates
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  return picked.map((ex) => ({
    exerciseId: ex.id,
    name: ex.name,
    picture: ex.thumbnailUrl ?? "",
    description: `Bài tập thay thế với cường độ ${ex.difficulty}, tác động lên ${describeMuscles(ex.muscleGroups)}.`,
    difficulty: DIFFICULTY_MAP[ex.difficulty as keyof typeof DIFFICULTY_MAP] ?? "intermediate",
  }));
}

function splitMuscleGroups(
  groups: string[],
): { primary: MuscleSlug[]; secondary: MuscleSlug[] } {
  if (groups.length <= 2) return { primary: groups as MuscleSlug[], secondary: [] };
  return {
    primary: groups.slice(0, 2) as MuscleSlug[],
    secondary: groups.slice(2) as MuscleSlug[],
  };
}

function buildGuide(
  exercise: (typeof exercisesData)[0],
  allExercises: (typeof exercisesData),
): IExerciseGuide {
  const pattern = SLUG_TO_PATTERN[exercise.slug] ?? "squat";
  const generator = PATTERN_GENERATORS[pattern] ?? PATTERN_GENERATORS.squat;

  const { steps, mistakes } = generator(
    exercise.name,
    exercise.muscleGroups,
    exercise.equipment,
    exercise.difficulty,
  );

  // Điều chỉnh step title cho exercise có tên cụ thể
  const nameMatch = exercise.name.match(/^([^(]+)/);
  const shortName = nameMatch ? nameMatch[1].trim() : exercise.slug;

  const alternatives = pickAlternatives(exercise, allExercises);
  const { primary, secondary } = splitMuscleGroups(exercise.muscleGroups);

  return {
    exerciseId: exercise.id,
    executionSteps: steps.map((s, i) => ({
      ...s,
      title: s.title,
      description: s.description,
    })),
    mistakes,
    alternatives,
    primaryMuscles: primary,
    secondaryMuscles: secondary,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export const seedExerciseGuides = async (): Promise<void> => {
  const existingSnap = await getDocs(
    query(collection(db, GUIDES_COLLECTION), limit(1)),
  );
  if (!existingSnap.empty) {
    console.log("[Seed] exercise_guides already seeded — skipping.");
    return;
  }

  const allExercises: (typeof exercisesData) = exercisesData;

  if (allExercises.length === 0) {
    console.warn("[Seed] exercise-library-export.json is empty. Nothing to seed.");
    return;
  }

  const guidesCol = collection(db, GUIDES_COLLECTION);
  let created = 0;

  for (const exercise of allExercises) {
    const guide = buildGuide(exercise, allExercises);

    if (!SLUG_TO_PATTERN[exercise.slug]) {
      console.warn(`[Seed] ⚠️ Unmapped slug: "${exercise.slug}" — using default "squat" pattern.`);
    }

    await setDoc(doc(guidesCol, exercise.id), guide);
    created++;
    console.log(
      `[Seed] Created guide for "${exercise.name}" (${exercise.id}) — pattern: ${SLUG_TO_PATTERN[exercise.slug] ?? "default"}, ` +
      `${guide.executionSteps.length} steps, ${guide.alternatives.length} alternatives.`,
    );
  }

  console.log(`[Seed] Done! ${created} exercise guides created.`);
};
