import "./style.css";
import {
  appName,
  appVersion,
  getFromStorage,
  initialTasks,
  saveToStorage,
  type Task,
  type TaskStatus
} from "./types";

const STORAGE_KEY = "taskly-tasks";
let tasks: Task[] = getFromStorage<Task[]>(STORAGE_KEY, initialTasks);
let activeFilter: TaskStatus = "all";
let editingId: number | null = null;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Elemen aplikasi tidak ditemukan.");

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    };
    return entities[char] ?? char;
  });

const formatDate = (date: string): string => {
  if (!date) return "Belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
};

function render(): void {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === "pending") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return true;
  });

  app!.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="Taskly beranda">
          <span class="brand-mark">✓</span><span>taskly<span class="brand-dot">.</span></span>
        </a>
        <span class="version">WEB APP · v${escapeHtml(appVersion)}</span>
      </header>

      <main>
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow"><span class="eyebrow-dot"></span> YOUR STUDY COMPANION</span>
            <h1>Atur tugasmu,<br /><span>kejar tujuanmu.</span></h1>
            <p>Semua tugas kuliah dalam satu tempat. Biar lebih teratur dan nggak ada deadline yang terlewat.</p>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="art-circle"></div>
            <div class="art-card"><span class="art-check">✓</span><div><b>One task at a time</b><small>You're doing great!</small></div></div>
            <span class="art-spark spark-one">✳</span><span class="art-spark spark-two">✦</span>
          </div>
        </section>

        <section class="stats" aria-label="Ringkasan tugas">
          <article class="stat-card"><span class="stat-icon purple">▤</span><div><small>Total tugas</small><strong>${tasks.length}</strong></div></article>
          <article class="stat-card"><span class="stat-icon orange">◷</span><div><small>Belum selesai</small><strong>${pending}</strong></div></article>
          <article class="stat-card"><span class="stat-icon green">✓</span><div><small>Selesai</small><strong>${completed}</strong></div></article>
        </section>

        <section class="workspace">
          <div class="section-heading">
            <div><span class="eyebrow">STAY ON TRACK</span><h2>Daftar tugas</h2></div>
            <span class="task-count">${tasks.length} tugas tersimpan</span>
          </div>

          <form id="task-form" class="task-form">
            <div class="form-title"><span class="plus-icon">＋</span><div><b id="form-heading">${editingId ? "Edit tugas" : "Tambah tugas baru"}</b><small>Isi detail tugas kuliahmu di bawah ini</small></div></div>
            <div class="form-grid">
              <label class="field field-wide">Nama tugas<input id="title" name="title" placeholder="Contoh: Membuat makalah..." required maxlength="90" /></label>
              <label class="field">Mata kuliah<input id="course" name="course" placeholder="Nama mata kuliah" required maxlength="60" /></label>
              <label class="field">Deadline<input id="dueDate" name="dueDate" type="date" /></label>
            </div>
            <div class="form-actions"><button class="btn-ghost" id="cancel-edit" type="button" hidden>Batal</button><button class="btn-primary" id="submit-task" type="submit">＋ Tambahkan tugas</button></div>
          </form>

          <div class="list-toolbar">
            <div class="filters" role="group" aria-label="Filter tugas">
              <button class="filter ${activeFilter === "all" ? "active" : ""}" data-filter="all">Semua <span>${tasks.length}</span></button>
              <button class="filter ${activeFilter === "pending" ? "active" : ""}" data-filter="pending">Belum selesai <span>${pending}</span></button>
              <button class="filter ${activeFilter === "completed" ? "active" : ""}" data-filter="completed">Selesai <span>${completed}</span></button>
            </div>
          </div>
          <div class="task-list">
            ${visibleTasks.length ? visibleTasks.map(taskTemplate).join("") : `
              <div class="empty-state"><div class="empty-icon">✧</div><b>Belum ada tugas di sini</b><p>${activeFilter === "all" ? "Tambahkan tugas pertamamu lewat formulir di atas." : "Coba pilih filter yang lain."}</p></div>
            `}
          </div>
        </section>
        <footer><span>© 2026 ${escapeHtml(appName)}</span><span>Small steps, big progress <b>✦</b></span></footer>
      </main>
    </div>`;
  bindEvents();
  if (editingId !== null) fillEditForm();
}

function taskTemplate(task: Task): string {
  return `
    <article class="task-item ${task.completed ? "is-complete" : ""}">
      <button class="check-button ${task.completed ? "checked" : ""}" data-action="toggle" data-id="${task.id}" aria-label="${task.completed ? "Tandai belum selesai" : "Tandai selesai"}">${task.completed ? "✓" : ""}</button>
      <div class="task-info"><b>${escapeHtml(task.title)}</b><div class="task-meta"><span class="course-tag">${escapeHtml(task.course)}</span><span class="deadline">◷ ${formatDate(task.dueDate)}</span></div></div>
      <span class="status ${task.completed ? "done" : "waiting"}">${task.completed ? "Selesai" : "Belum selesai"}</span>
      <div class="task-actions"><button data-action="edit" data-id="${task.id}" aria-label="Edit tugas">✎</button><button data-action="delete" data-id="${task.id}" aria-label="Hapus tugas">×</button></div>
    </article>`;
}

function bindEvents(): void {
  document.querySelector<HTMLFormElement>("#task-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector<HTMLInputElement>("#title")!;
    const courseInput = document.querySelector<HTMLInputElement>("#course")!;
    const dateInput = document.querySelector<HTMLInputElement>("#dueDate")!;
    const title = titleInput.value.trim();
    const course = courseInput.value.trim();
    if (!title || !course) return;

    if (editingId !== null) {
      tasks = tasks.map((task) => task.id === editingId
        ? { ...task, title, course, dueDate: dateInput.value }
        : task);
      editingId = null;
    } else {
      tasks.unshift({
        id: Date.now(),
        title,
        course,
        dueDate: dateInput.value,
        completed: false
      });
    }
    persist();
    render();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter as TaskStatus;
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const action = button.dataset.action;
      if (action === "toggle") {
        tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
      } else if (action === "delete") {
        if (!window.confirm("Yakin ingin menghapus tugas ini?")) return;
        tasks = tasks.filter((task) => task.id !== id);
      } else if (action === "edit") {
        editingId = id;
        render();
        return;
      }
      persist();
      render();
    });
  });

  document.querySelector<HTMLButtonElement>("#cancel-edit")?.addEventListener("click", () => {
    editingId = null;
    render();
  });
}

function fillEditForm(): void {
  const task = tasks.find((item) => item.id === editingId);
  if (!task) return;
  (document.querySelector<HTMLInputElement>("#title")!).value = task.title;
  (document.querySelector<HTMLInputElement>("#course")!).value = task.course;
  (document.querySelector<HTMLInputElement>("#dueDate")!).value = task.dueDate;
  document.querySelector("#form-heading")!.textContent = "Edit tugas";
  document.querySelector("#submit-task")!.textContent = "Simpan perubahan";
  document.querySelector<HTMLButtonElement>("#cancel-edit")!.hidden = false;
  document.querySelector(".task-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function persist(): void {
  saveToStorage<Task[]>(STORAGE_KEY, tasks);
}

render();