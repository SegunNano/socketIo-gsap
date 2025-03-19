import gsap from "gsap"; // Correct way to import in Vite

gsap.from(".box-3", {
  opacity: 0,
  //   y: -50,
  //   x: 50,
  duration: 2,
  yoyo: true,
  repeat: -1,
});
gsap.from(".box-1", {
  //   opacity: 0,
  //   y: -50,
  x: -50,
  duration: 2,
  yoyo: true,
  repeat: -1,
});
gsap.from(".box-5", {
  //   opacity: 0,
  //   y: -50,
  x: 50,
  duration: 2,
  yoyo: true,
  repeat: -1,
});
gsap.from(".box-4 ", {
  opacity: 50,
  y: 50,
  //   x: 50,
  duration: 2,
  yoyo: true,
  repeat: -1,
});
gsap.from(".box-2", {
  opacity: 50,
  y: -50,
  //   x: 50,
  duration: 2,
  yoyo: true,
  repeat: -1,
});
