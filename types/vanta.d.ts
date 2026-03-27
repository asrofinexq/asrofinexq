declare module "vanta/dist/vanta.globe.min" {
  type VantaEffectInstance = { destroy: () => void };
  type VantaGlobe = (options: any) => VantaEffectInstance;
  const Globe: VantaGlobe;
  export default Globe;
}

