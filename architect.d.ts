declare module "AR" {

  type RecognizedCallback = (recognized: boolean, recognitionData: { targetInfo?: any, metadata?: any }) => void;
  type InterruptionCallback = (suggestedInterval?: number) => void;
  type ErrorCallback = (code: number, errorObject: Error) => void;

  const CONST : {
    ANIMATION_GROUP_TYPE: { PARALLEL: 'parallel', SEQUENTIAL: 'sequential' };
    CAMERA_FOCUS_MODE: { ONCE: string, CONTINUOUS: string, OFF: string };
    CAMERA_POSITION: { FRONT: string, BACK: string };
    CLICK_BEHAVIOR: { CLICK: string, TOUCH_UP: string, TOUCH_DOWN: string };
    CLOUD_RECOGNITION_SERVER_REGION: { AMERICAS: string, CHINA: string, EUROPE: string };
    EASING_CURVE_TYPE: EASING_CURVE_TYPE
    FONT_STYLE: { NORMAL: string, BOLD: string, ITALIC: string };
    HORIZONTAL_ANCHOR: { LEFT: string, CENTER: string, RIGHT: string };
    LOCATION_ACCURACY: { HIGH: string, MEDIUM: string, LOW: string };
    STATE: { INITIALIZED: string, LOADING: string, LOADED: string, PLAYING: string, ERROR: string };
    UNKNOWN_ALTITUDE: number;
    VERTICAL_ANCHOR: { TOP: number, MIDDLE: number, BOTTOM: number };
  }

  /**
   * ARchitectObject is the base class for each object created through the ARchitect.
   */
  class ARchitectObject {
    destroyed: boolean;
    destroy(): void;
  }

  /**
   * An ActionArea defines a certain geo area where actions should be executed on enter and on exit. An ActionArea is a 2-dimensional area, altitude will be ignored. As soon as the user enters the ActionArea, onEnter() will be executed (in case the function is defined). When the user leaves the ActionArea, onExit() will be executed (in case the function is defined).
   */
  class ActionArea extends ARchitectObject {
    enabled: boolean;

    /**
     * checks if a certain location is within this ActionArea.
     * @param geoLocation - the GeoLocation that should be checked.
     * @returns {boolean} true if the geoLocation passed to the method is within the ActionArea, false if the geoLocation passed to the method is not in the ActionArea
     */
    isInArea(geoLocation: Geolocation): boolean

    /**
     * The trigger is executed when the user enters the ActionArea.
     */
    onEnter?: () => void;
    /**
     * The trigger is executed when the user leaves the ActionArea.
     */
    onExit?: () => void;
  }

  /**
   * An ActionRange defines a circle around a certain Location. Events are fired as soon as the user enters or leaves this circle.
   */
  class ActionRange extends ActionArea {

    public location: Location;
    public radius: number;

    /**
     * @param location - a single Location defining the center point of the circle.
     * @param radius - the radius of the ActionRange in meters.
     * @param options - Setup-Parameters to customize additional object properties. 
     */
    constructor(
      location: Location,
      radius: number,
      options: { enabled: boolean, onEnter?: () => void, onExit?: () => void }
    )

  }


  class Drawable extends ARchitectObject implements DrawableOptions {
    public enabled: boolean;
    public mirrored: boolean;
    public rotate: Vector3;
    public rotatesToCamera: boolean;
    public scale: Vector3;
    public translate: Vector3;

    onClick?: (arObject: ARObject) => void;
    onDragBegan?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onDragChanged?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onDragEnded?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onPanBegan?: (xNormalized: number, yNormalized: number) => void;
    onPanChanged?: (xNormalized: number, yNormalized: number) => void;
    onPanEnded?: (xNormalized: number, yNormalized: number) => void;
    onRotationBegan?: (angle: number) => void;
    onRotationChanged?: (angle: number) => void;
    onRotationEnded?: (angle: number) => void;
    onScaleBegan?: (scale: number) => void;
    onScaleChanged?: (scale: number) => void;
    onscaleEnded?: (scale: number) => void;
  }

  class Drawable2D extends Drawable implements Drawable2DOptions {
    horizontalAnchor: number;
    verticalAnchor: number;
    zOrder: number;
    opacity: number;
    /**
     * Returns the BoundingRectangle for this Drawable2D. In case of an error, null will be returned.
     * @returns {BoundingRectangle} - the BoundingRectangle for the Drawable2D.
     */
    getBoundingRectangle(): BoundingRectangle
  }

  class ImageDrawable extends Drawable2D {
    public height: number;
    public imageResource: ImageResource;

    constructor(imageResource: ImageResource, height: number, options: Drawable2DOptions)
  }

  class AnimatedImageDrawable extends ImageDrawable {
    constructor(
      imageResource: ImageResource,
      height: number,
      keyFrameWidth: number,
      keyFrameHeight: number,
      options?: Drawable2DOptions
    )

    animate(keyFrames: number[], duration: number, loopTimes?: number)
    setKeyFrame(keyFramePos: number)
  }


  class ARObject extends ARchitectObject {
    drawables: ARObjectDrawables;
    enabled: boolean;
    renderingOrder: number;

    isVisible(): boolean;

    onClick?: (arObject: ARObject) => void;
    onDragBegan?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onDragChanged?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onDragEnded?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onPanBegan?: (xNormalized: number, yNormalized: number) => void;
    onPanChanged?: (xNormalized: number, yNormalized: number) => void;
    onPanEnded?: (xNormalized: number, yNormalized: number) => void;
    onRotationBegan?: (angle: number) => void;
    onRotationChanged?: (angle: number) => void;
    onRotationEnded?: (angle: number) => void;
    onScaleBegan?: (scale: number) => void;
    onScaleChanged?: (scale: number) => void;
    onscaleEnded?: (scale: number) => void;
  }

  class ARObjectDrawables {
    cam: Drawable[];
    addCamDrawable: (drawable: Drawable | Drawable[], position: number) => void;
    removeCamDrawable: (drawableOrPosition: Drawable | Drawable[] | number) => void;
  }

  class Animation extends ARchitectObject {
    isRunning(): boolean;
    pause(): void;
    resume(): void;
    start(): void;
    stop(): void;

    onStart?: () => void;
    onFinish?: () => void;
  }

  class AnimationGroup extends Animation {
    constructor(
      type: string,
      animations: Animation[],
      options: { onStart?: () => void, onFinish?: () => void }
    )
  }

  class ImageResource extends ARchitectObject {
    constructor(uri: string, options: { onLoaded?: () => void, onError?: void; });

    getHeight(): number;
    getWidth(): number;
    getUri(): string;
    isLoaded(): boolean;

    onLoaded?: () => void;
    onError?: () => void;
  }

  class BoundingRectangle {
    getWidth(): number;
    getHeight(): number;
  }

  /**
   * Location is an abstract class which describes a general location of a POI in the augmented scene.
   */
  class Location extends ARchitectObject {
    /**
     * Returns the shortest distance ("as the crow flies") to the Location passed as an argument, ignoring any altitude property.
     * @param {Location} location - The Location the distance should be calculated for.
     * @returns {number} - The numeric distance in meters.
     */
    distanceTo(location: Location): number;

    /**
     * Returns the shortest distance ("as the crow flies") to the current location of the user, ignoring any altitude property.
     * If the current position of the user cannot be determined, undefined will be returned.
     * @returns {number|undefined}
     */
    distanceToUser(): number;
  }

  /**
   * Every instance of GeoLocation represents a location in the earth's three-dimensional space. 
   * @param {number} latitude - The latitude of the location, in decimal degrees.
   * @param {number} longitude - The longitude of the location, in decimal degrees.
   * @param {number} altitude - The altitude of the location, in meters.
   */
  class GeoLocation extends Location {

    public latitude: number;
    public longitude: number;
    public altitude: number;

    constructor(
      latitude: number,
      longitude: number,
      altitude: number
    )

  }

  class Circle extends Drawable2D {
    public radius: number;
    public style: { fillColor: string, outlineSize: number, outlineColor: string };
    constructor(radius: number, options?: Drawable2DOptions)
  }

  const context: {
    destroyAll(),
    openInBrowser(url: string, forceNativeBrowser: boolean),
    setCloudRecognitionServerRegion(region: string, options?: { serverUrl: string, onSuccess?: () => void, onError?: () => void }),
    startVideoPlayer(uri)

    clickBehavior: string,
    scene: {
      cullingDistance: number,
      globalScale: number,
      maxScalingDistance: number,
      minScalingDistance: number,
      scalingFactor: number,
      readonly versionNumber: string
    }

    on2FingerGestureEnded?: () => void;
    on2FingerGestureStarted?: () => void;
    onDragBegan?: (xNormalized: number, yNormalized: number) => void;
    onDragChanged?: (xNormalized: number, yNormalized: number) => void;
    onDragEnded?: (xNormalized: number, yNormalized: number) => void;
    onLocationChanged?: (latitude: number, longitude: number, altitude: number, accuracy: number) => void;
    onPanBegan?: (xNormalized: number, yNormalized: number) => void;
    onPanChanged?: (xNormalized: number, yNormalized: number) => void;
    onPanEnded?: (xNormalized: number, yNormalized: number) => void;
    onRotationBegan?: (angle: number) => void;
    onRotationChanged?: (angle: number) => void;
    onRotationEnded?: (angle: number) => void;
    onScaleBegan?: (scale: number) => void;
    onScaleChanged?: (scale: number) => void;
    onscaleEnded?: (scale: number) => void;
    onScreenClick?: () => void;
  }

  const hardware: {
    readonly camera: {
      enabled: boolean,
      features: {},
      flashlightAvailable: boolean,
      focusDistance: number,
      manualFocusAvailable: number,
      position: {},
      zoom: number
    },
    readonly sensors: {
      enabled: boolean,
      compass: {
        correctionAngle: number
      }
    }
  }

  class HtmlDrawable extends Drawable2D {
    allowDocumentLocationChanges: boolean;
    backgroundColor: string;
    clickThroughEnabled: string;
    html: string;
    uri: string;
    viewportHeight: number;
    viewportWidth: number;
    width: number;

    constructor(content: { html?: string, uri?: string }, width: number, options)
    evalJavaScript(js: string);
  }

  class GeoObject extends ARObject {
    drawables: GeoObjectDrawables;
    constructor(location: Location | Location[], options?: GeoObjectOptions)
  }

  class GeoObjectDrawables extends ARObjectDrawables {
    indicator: Drawable2D[];
    radar: Drawable2D[];
    locations: Location[];

    addIndicatorDrawable(drawable: Drawable2D | Drawable2D[], position: number): void;
    addRadarDrawable(drawable: Drawable2D | Drawable2D[], position: number): void;
    removeIndicatorDrawable(drawableOrPosition: Drawable2D | Drawable2D[] | number): void;

    onEnterFieldOfVision?: () => void;
    onExitFieldOfVision?: () => void;
  }

  class EasingCurve extends ARchitectObject {
    public amplitude: number;
    public overshoot: number;
    public period: number;
    constructor(type: string, options?: { amplitude?: number, overshoot?: number, period?: number });
  }

  const logger: {
    activateDebugMode: () => void
    debug: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
  }

  const platform: {
    sendJSONObject(jsonData: any)
  }

  class ImageTrackable extends ARObject {
    aspectRatio: number;
    enableExtendedTracking: boolean;
    extendedTarget: string;
    targetName: string;
    tracker: ImageTracker;

    constructor(tracker: ImageTracker, targetName: string, options: ImageTrackableOptions)
    stopExtendedTracking();

    onExtendedTrackingQualityChanged?: (targetName: string, previousQuality: number, newQuality: number) => void;
  }

  class ImageTracker extends ARchitectObject {
    enabled?: boolean;
    physicalTargetImageHeights?: any;

    constructor(tracker: TargetCollectionResource, options?: ImageTrackerOptions)
    constructor(tracker: CloudRecognitionService, options?: ImageTrackerOptions)

    onDisabled?: () => void;
    onError?: () => void;
    onTargetsLoaded?: () => void;
  }

  class ImageTrackerOptions {
    enabled?: boolean;
    physicalTargetImageHeights?: any;
    onTargetsLoaded?: () => void;
    onError?: () => void;
    onDisabled?: () => void;
  }

  class TargetCollectionResource extends ARchitectObject {
    loading: boolean;
    URL: string;

    constructor(URL: string, options?: { onLoaded?: () => void, onError?: () => void })
    cancel()

    onError?: () => void;
    onLoaded?: () => void;
  }

  class CloudRecognitionService extends ARchitectObject {
    clientToken?: string;
    targetCollectionId?: string;

    recognize(onRecognized?: RecognizedCallback, onError?: ErrorCallback): void;
    startContinuousRecognition(interval: number, onInterruptionCallback?: InterruptionCallback, onRecognizedCallback?: RecognizedCallback, onErrorCallback?: ErrorCallback): void;
    stopContinuousRecognition(): void;

    onError?: () => void;
    onInitialized?: () => void;
  }

  class ImageTrackableOptions extends Drawable2DOptions {
    renderingOrder?: number;
    onImageRecognised?: () => void;
    onImageLost?: () => void;
    drawables?: { cam: Drawable[] };
    distanceToTarget?: {
      changedThreshold: number;
      onDistanceChanged?: () => void;
    }
    enableExtendedTracking?: boolean;
    entendedTarget?: string;
    extendedTrackingQualityChanged?: () => void;
  }

  class InstantTrackable extends ARObject {
    readonly tracker: InstantTracker;
    constructor(tacker: InstantTracker, options?: InstantTrackableOptions)

    onTrackingStarted?: () => void;
    onTrackingStopped?: () => void;
    onTrackingPlaneClick?: (xIntersection: number, yIntersection: number) => void;
    onTrackingPlaneDragBegan?: (xIntersection: number, yIntersection: number) => void;
    onTrackingPlaneDragChanged?: (xIntersection: number, yIntersection: number) => void;
    onTrackingPlaneDragEnded?: (xIntersection: number, yIntersection: number) => void;
  }

  class InstantTrackableOptions extends _EVENT_HANDLERS {
    enabled?: boolean;
    renderingOrder?: number;
    drawables: {
      cam: Drawable[],
      initialization: Drawable[]
    };
    onTrackingStarted?: () => void;
    onTrackingStopped?: () => void;
    onTrackingPlaneClick?: (xIntersection: number, yIntersection: number) => void;
    onTrackingPlaneDragBegan?: (xIntersection: number, yIntersection: number) => void;
    onTrackingPlaneDragChanged?: (xIntersection: number, yIntersection: number) => void;
    onTrackingPlaneDragEnded?: (xIntersection: number, yIntersection: number) => void;
  }

  class InstantTracker extends ARchitectObject {
    enabled?: boolean;
    state?: number;
    deviceHeight?: string

    constructor(
      options?: {
        enabled?: boolean,
        onError?: () => void,
        onDisabled?: () => void,
        onChangedState?: () => void,
        deviceHeight?: number
      }
    )

    onError?: () => void;
    onDisabled?: () => void;
    onChangedState?: () => void;
  }

  class EASING_CURVE_TYPE {
    "LINEAR": "linear"
    "EASE_IN_QUAD": "easeInQuad"
    "EASE_OUT_QUAD": "easeOutQuad"
    "EASE_IN_OUT_QUAD": "easeInOutQuad"
    "EASE_OUT_IN_QUAD": "easeOutInQuad"
    "EASE_IN_CUBIC": "easeInCubic"
    "EASE_OUT_CUBIC": "easeOutCubic"
    "EASE_IN_OUT_CUBIC": "easeInOutCubic"
    "EASE_OUT_IN_CUBIC": "easeOutInCubic"
    "EASE_IN_QUAT": "easeInQuat"
    "EASE_OUT_QUAT": "easeOutQuat"
    "EASE_IN_OUT_QUAT": "easeInOutQuat"
    "EASE_OUT_IN_QUAT": "easeOutInQuat"
    "EASE_IN_QUINT": "easeInQuint"
    "EASE_OUT_QUINT": "easeOutQuint"
    "EASE_IN_OUT_QUINT": "easeInOutQuint"
    "EASE_OUT_IN_QUINT": "easeOutInQuint"
    "EASE_IN_ELASTIC": "easeInElastic"
    "EASE_OUT_ELASTIC": "easeOutElastic"
    "EASE_IN_OUT_ELASTIC": "easeInOutElastic"
    "EASE_OUT_IN_ELASTIC": "easeOutInElastic"
    "EASE_IN_BACK": "easeInBack"
    "EASE_OUT_BACK": "easeOutBack"
    "EASE_IN_OUT_BACK": "easeInOutBack"
    "EASE_OUT_IN_BACK": "easeOutInBack"
    "EASE_IN_SINE": "easeInSine"
    "EASE_OUT_SINE": "easeOutSine"
    "EASE_IN_OUT_SINE": "easeInOutSine"
    "EASE_OUT_IN_SINE": "easeOutInSine"
    "EASE_IN_EXPO": "easeInExpo"
    "EASE_OUT_EXPO": "easeOutExpo"
    "EASE_IN_OUT_EXPO": "easeInOutExpo"
    "EASE_OUT_IN_EXPO": "easeOutInExpo"
    "EASE_IN_CIRC": "easeInCirc"
    "EASE_OUT_CIRC": "easeOutCirc"
    "EASE_IN_OUT_CIRC": "easeInOutCirc"
    "EASE_OUT_IN_CIRC": "easeOutInCirc"
    "EASE_IN_BOUNCE": "easeInBounce"
    "EASE_OUT_BOUNCE": "easeOutBounce"
    "EASE_IN_OUT_BOUNCE": "easeInOutBounce"
    "EASE_OUT_IN_BOUNCE": "easeOutInBounce"
    "EASE_IN_CURVE": "easeInCurve"
    "EASE_OUT_CURVE": "easeOutCurve"
  }

  class DrawableOptions extends _EVENT_HANDLERS {
    enabled?: boolean;
    mirrored?: boolean;
    rotate?: Vector3;
    rotatesToCamera?: boolean;
    scale?: Vector3;
    translate?: Vector3;
  }

  class Drawable2DOptions extends DrawableOptions {
    opacity?: number;
    horizontalAnchor?: number;
    verticalAnchor?: number;
    zOrder?: number;
  }

  class GeoObjectOptions extends DrawableOptions {
    drawables: { cam: Drawable2D | Drawable2D[] }
    renderingOrder?: number;
    onEnterFieldOfVision?: () => void;
    onExitFieldOfVision?: () => void;
  }

  class Label extends Drawable2D {
    height: number;
    style: {
      backgroundColor: string,
      textColor: string,
      fontStyle: number
    };
    text: string;
    constructor( text: string, height: number, options?: LabelOptions) 
  }

  class Model extends Drawable {
    uri: string;
    constructor(uri: string, options: DrawableOptions)
    isInitialized() : boolean;
    isLoaded() : boolean;

    onError?: () => void;
    onInitialized?: () => void;
    onLoaded?: () => void;
  }

  class ModelAnimation extends Animation {
    constructor(
      model: Model, 
      animationId: string, 
      options?: { onStart?: () => void, onFinish?: () => void }, 
      duration?: number
    )
  }

  class Positionable extends ARObject {
    name: string;
    constructor(name: string, options?: PositionableOptions)
  }

  class PositionableOptions extends DrawableOptions {
    drawables: {
      cam: Drawable[]
    };
    onEnterFieldOfVision?: () => void;
    onExitFieldOfVision?: () => void;
  }

  class LabelOptions extends Drawable2DOptions {
    style: {
      backgroundColor: string,
      textColor: string,
      fontStyle: number
    }
  }

  class PropertyAnimation extends Animation {
    constructor(
      target: ARchitectObject, 
      property: string, 
      start: number,
      end: number,
      duration: number,
      easingCurve?: EasingCurve,
      options?: {
        onStart?: () => void,
        onFinish?: () => void
      }
    )
  }

  class RelativeLocation extends Location {
    altitudeDelta: number;
    easting: number;
    northing: number;
    location : Location;

    constructor(
      location: Location, 
      northing: number, 
      easting: number, 
      altitudeDelta?: number
    )
  }

  type callback = (...arg: any[]) => void;

  class Sound extends ARchitectObject {
    state: number;
    constructor(uri: string, options?: { onLoaded?: callback, onError?: callback, onFinishedPlaying?: callback });

    load();
    pause();
    play(loopTimes: number);
    resume();
    stop();

    onLoaded?: callback;
    onError?: callback;
    onFinishedPlaying?: callback;
  }

  class Style {
    backgroundColor: string;
    fillColor: string;
    fontStyle: string;
    outlineColor: string;
    outlineSize: number;
    textColor: string; 
  }

  class VideoDrawable extends Drawable2D {
    height: number;
  
    constructor(uri: string, height: number, options?: VideoDrawableOptions)

    getUri() : string;
    isTransparent() : boolean;
    pause();
    play(loopTimes: number);
    resume();
    stop();

    onPlaybackStarted?: callback;
    onFinishedPlaying?: callback;
    onFinish?: callback;
    onLoaded?: callback; 
  }

  class radar {
    background: ImageResource;
    centerX: number;
    centerY: number;
    container: Element;
    enabled: boolean;
    northIndicator : {
      image : ImageResource,
      radius: number
    };
    radius: number;

    notifyUpdateRadarPosition();
  }

  class VideoDrawableOptions extends Drawable2DOptions {
    isTransparent?: boolean;
    onPlaybackStarted?: callback;
    onFinishedPlaying?: callback;
    onFinish?: callback;
    onLoaded?: callback; 
  }

  /** Please Don't use, does not actually exist in the Wikitude Architect, its just an easier way to describe it... */
  class Vector3 {
    x: number;
    y: number;
    z: number;
    global?: Vector3;
  }

  class _EVENT_HANDLERS {
    onClick?: (arObject: ARObject) => void;
    onDragBegan?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onDragChanged?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onDragEnded?: (xNormalized: number, yNormalized: number, xIntersection: number, yIntersection: number) => void;
    onPanBegan?: (xNormalized: number, yNormalized: number) => void;
    onPanChanged?: (xNormalized: number, yNormalized: number) => void;
    onPanEnded?: (xNormalized: number, yNormalized: number) => void;
    onRotationBegan?: (angle: number) => void;
    onRotationChanged?: (angle: number) => void;
    onRotationEnded?: (angle: number) => void;
    onScaleBegan?: (scale: number) => void;
    onScaleChanged?: (scale: number) => void;
    onscaleEnded?: (scale: number) => void;
  }
}
