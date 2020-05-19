export default class {
  constructor(data, cb) {
    this.data = data;
    this.cb = cb;
    this.ele = document.getElementById('timeline');
    this.progress = document.getElementById('progress');

    const start = data[0].time;
    const end = data[data.length - 1].time;
    this.duration = end - start;
    this.resize();

    this.ele.onclick = this.onTimelineClick;
  }

  onTimelineClick = (e) => {
    this.cb((e.clientX * (this.data.length / window.innerWidth)) | 0);
  };

  resize() {
    this.step = window.innerWidth / this.data.length;
  }

  updateProgress(i) {
    this.progress.style.width = `${i * this.step}px`;
  }
}
