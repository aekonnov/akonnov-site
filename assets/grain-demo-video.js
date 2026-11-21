(() => {
  "use strict";
  const section = document.querySelector("#video-demo");
  const video = section?.querySelector("video");
  if (!video) return;

  section.addEventListener("click", event => {
    const chapter = event.target.closest("a[data-video-start]");
    if (!chapter || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const second = Number(chapter.dataset.videoStart);
    if (!Number.isFinite(second) || video.error) return;
    event.preventDefault();
    video.currentTime = second;
    video.focus({preventScroll: true});
    video.scrollIntoView({block: "nearest"});
    video.play().catch(() => {});
  });
})();
