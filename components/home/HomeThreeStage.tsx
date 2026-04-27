"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type HomeRoom =
  | "hero"
  | "identity"
  | "play"
  | "systems"
  | "work"
  | "projects"
  | "portals"
  | "contact";

type RoomProfile = {
  color: THREE.ColorRepresentation;
  secondary: THREE.ColorRepresentation;
  camera: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
  spread: number;
};

const ROOM_PROFILES: Record<HomeRoom, RoomProfile> = {
  hero: {
    color: "#a855f7",
    secondary: "#67e8f9",
    camera: [0, 0.12, 7.2],
    rotation: [0.08, -0.12, 0],
    spread: 1,
  },
  identity: {
    color: "#ededed",
    secondary: "#a855f7",
    camera: [-0.28, 0.02, 6.4],
    rotation: [0.02, 0.16, -0.03],
    spread: 1.15,
  },
  play: {
    color: "#67e8f9",
    secondary: "#4ade80",
    camera: [0.18, -0.05, 6.1],
    rotation: [-0.05, -0.22, 0.04],
    spread: 1.35,
  },
  systems: {
    color: "#67e8f9",
    secondary: "#a855f7",
    camera: [0, 0, 5.8],
    rotation: [0.1, 0.02, 0],
    spread: 1.45,
  },
  work: {
    color: "#a855f7",
    secondary: "#4ade80",
    camera: [0.12, 0.08, 6.7],
    rotation: [0.18, 0.04, -0.02],
    spread: 0.82,
  },
  projects: {
    color: "#a855f7",
    secondary: "#67e8f9",
    camera: [0, -0.02, 5.55],
    rotation: [0.02, -0.38, 0.01],
    spread: 1.55,
  },
  portals: {
    color: "#67e8f9",
    secondary: "#a855f7",
    camera: [0, 0, 5.15],
    rotation: [0.03, 0.42, 0],
    spread: 1.72,
  },
  contact: {
    color: "#4ade80",
    secondary: "#67e8f9",
    camera: [0.1, -0.04, 6.2],
    rotation: [-0.08, 0.1, 0.02],
    spread: 0.72,
  },
};

type StageObject = {
  group: THREE.Group;
  material: THREE.MeshBasicMaterial;
  edgeMaterial: THREE.LineBasicMaterial;
  basePosition: THREE.Vector3;
  baseRotation: THREE.Euler;
  label?: THREE.Sprite;
};

function makeLabelTexture(label: string, sublabel: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "700 70px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "rgba(237,237,237,0.72)";
  ctx.fillText(label, 34, 110);
  ctx.font = "24px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = "rgba(103,232,249,0.72)";
  ctx.fillText(sublabel.toUpperCase(), 38, 164);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createGlassPlane(
  label: string,
  sublabel: string,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple,
) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: "#a855f7",
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: "#67e8f9",
    transparent: true,
    opacity: 0.26,
    blending: THREE.AdditiveBlending,
  });
  const geometry = new THREE.PlaneGeometry(2.35, 1.36, 1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    edgeMaterial,
  );

  group.add(mesh, edges);

  const texture = makeLabelTexture(label, sublabel);
  let sprite: THREE.Sprite | undefined;
  if (texture) {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.55, 0.78, 1);
    sprite.position.set(-0.25, -0.05, 0.02);
    group.add(sprite);
  }

  group.position.set(...position);
  group.rotation.set(...rotation);

  return {
    group,
    material,
    edgeMaterial,
    basePosition: group.position.clone(),
    baseRotation: group.rotation.clone(),
    label: sprite,
  };
}

function createPortalFrame(
  position: THREE.Vector3Tuple,
  scale: THREE.Vector3Tuple,
) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: "#a855f7",
    transparent: true,
    opacity: 0.04,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: "#67e8f9",
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
  });
  const geometry = new THREE.PlaneGeometry(2.6, 1.55);
  const mesh = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    edgeMaterial,
  );
  group.add(mesh, edges);
  group.position.set(...position);
  group.scale.set(...scale);

  return {
    group,
    material,
    edgeMaterial,
    basePosition: group.position.clone(),
    baseRotation: group.rotation.clone(),
  };
}

function createFieldLines() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: "#67e8f9",
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
  });

  for (let i = -5; i <= 5; i += 1) {
    const z = i * 0.7;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5.2, -1.55, z),
      new THREE.Vector3(5.2, -1.55, z),
    ]);
    group.add(new THREE.Line(geometry, material));
  }

  for (let i = -5; i <= 5; i += 1) {
    const x = i * 0.92;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -1.55, -3.8),
      new THREE.Vector3(x, -1.55, 3.8),
    ]);
    group.add(new THREE.Line(geometry, material));
  }

  group.rotation.x = -0.42;
  group.position.y = -1.05;
  group.position.z = -2.3;
  return { group, material };
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (
      child instanceof THREE.Mesh ||
      child instanceof THREE.LineSegments ||
      child instanceof THREE.Line
    ) {
      child.geometry?.dispose();
      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material?.dispose();
      }
    }
    if (child instanceof THREE.Sprite) {
      child.material.map?.dispose();
      child.material.dispose();
    }
  });
}

export function HomeThreeStage() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(...ROOM_PROFILES.hero.camera);

    const rig = new THREE.Group();
    scene.add(rig);

    const objects: StageObject[] = [
      createGlassPlane(
        "build",
        "systems",
        [-2.4, 0.8, -1.4],
        [0.1, 0.48, 0.02],
      ),
      createGlassPlane(
        "play",
        "rhythm",
        [2.2, 0.38, -0.9],
        [-0.08, -0.56, -0.04],
      ),
      createGlassPlane(
        "notice",
        "light",
        [-1.65, -1.05, -1.9],
        [-0.16, 0.28, -0.06],
      ),
      createGlassPlane(
        "make",
        "craft",
        [1.82, -1.18, -2.3],
        [0.18, -0.34, 0.08],
      ),
      createPortalFrame([-1.45, 0.15, -3.2], [0.82, 0.82, 0.82]),
      createPortalFrame([0, 0.06, -2.65], [1, 1, 1]),
      createPortalFrame([1.45, -0.04, -2.1], [1.18, 1.18, 1.18]),
    ];
    objects.forEach((object) => rig.add(object.group));

    const field = createFieldLines();
    rig.add(field.group);

    let width = 1;
    let height = 1;
    let raf = 0;
    let room: HomeRoom = "hero";
    let scrollProgress = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const currentCamera = new THREE.Vector3(...ROOM_PROFILES.hero.camera);
    const targetCamera = new THREE.Vector3(...ROOM_PROFILES.hero.camera);
    const currentRotation = new THREE.Vector3(...ROOM_PROFILES.hero.rotation);
    const targetRotation = new THREE.Vector3(...ROOM_PROFILES.hero.rotation);
    const currentColor = new THREE.Color(ROOM_PROFILES.hero.color);
    const targetColor = new THREE.Color(ROOM_PROFILES.hero.color);
    const currentSecondary = new THREE.Color(ROOM_PROFILES.hero.secondary);
    const targetSecondary = new THREE.Color(ROOM_PROFILES.hero.secondary);

    const applyRoom = (next: HomeRoom) => {
      room = next;
      const profile = ROOM_PROFILES[next];
      targetCamera.set(...profile.camera);
      targetRotation.set(...profile.rotation);
      targetColor.set(profile.color);
      targetSecondary.set(profile.secondary);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.tx = event.clientX / Math.max(width, 1) - 0.5;
      pointer.ty = event.clientY / Math.max(height, 1) - 0.5;
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      scrollProgress = window.scrollY / maxScroll;
    };

    const scores = new Map<Element, number>();
    const rooms = new Map<Element, HomeRoom>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          scores.set(entry.target, entry.intersectionRatio);
        }

        let nextRoom: HomeRoom | null = null;
        let best = 0;
        for (const [element, score] of scores) {
          const candidate = rooms.get(element);
          if (candidate && score > best) {
            best = score;
            nextRoom = candidate;
          }
        }

        if (nextRoom && best > 0.12) applyRoom(nextRoom);
      },
      { threshold: [0, 0.12, 0.28, 0.5, 0.75] },
    );

    const attachRooms = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-home-room]"),
      );
      for (const section of sections) {
        const sectionRoom = section.dataset.homeRoom as HomeRoom | undefined;
        if (!sectionRoom) continue;
        rooms.set(section, sectionRoom);
        scores.set(section, 0);
        observer.observe(section);
      }
    };

    const animate = (timeMs: number) => {
      const time = timeMs / 1000;
      const ease = reduced.matches ? 1 : 0.055;
      pointer.x += (pointer.tx - pointer.x) * 0.1;
      pointer.y += (pointer.ty - pointer.y) * 0.1;
      currentCamera.lerp(targetCamera, ease);
      currentRotation.lerp(targetRotation, ease);
      currentColor.lerp(targetColor, 0.06);
      currentSecondary.lerp(targetSecondary, 0.06);

      camera.position.copy(currentCamera);
      camera.position.x += pointer.x * 0.28;
      camera.position.y += pointer.y * -0.18;
      camera.lookAt(pointer.x * 0.2, pointer.y * -0.16, -1.6);

      rig.rotation.x = currentRotation.x + pointer.y * 0.08;
      rig.rotation.y = currentRotation.y + pointer.x * 0.12;
      rig.rotation.z = currentRotation.z + Math.sin(time * 0.28) * 0.012;
      rig.position.z = scrollProgress * 0.7;

      const profile = ROOM_PROFILES[room];
      for (const [index, object] of objects.entries()) {
        object.material.color.copy(currentColor);
        object.edgeMaterial.color.copy(currentSecondary);
        object.material.opacity =
          room === "projects" || room === "portals" ? 0.075 : 0.045;
        object.edgeMaterial.opacity = 0.16 + profile.spread * 0.08;

        const orbit = index * 0.65 + time * 0.18;
        object.group.position.x =
          object.basePosition.x * profile.spread +
          Math.sin(orbit) * 0.05 +
          pointer.x * (0.16 + index * 0.015);
        object.group.position.y =
          object.basePosition.y +
          Math.cos(orbit) * 0.04 +
          pointer.y * (-0.12 - index * 0.012);
        object.group.position.z =
          object.basePosition.z +
          Math.sin(time * 0.22 + index) * 0.06;
        object.group.rotation.x =
          object.baseRotation.x + Math.sin(time * 0.35 + index) * 0.025;
        object.group.rotation.y = object.baseRotation.y + pointer.x * 0.1;
      }

      field.group.visible =
        room === "play" || room === "systems" || room === "projects";
      field.material.color.copy(currentSecondary);
      field.material.opacity = room === "play" ? 0.16 : 0.1;
      field.group.position.z = -2.3 + scrollProgress * 1.4;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    resize();
    attachRooms();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      cancelAnimationFrame(raf);
      disposeObject(rig);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="home-three-stage" aria-hidden />;
}
