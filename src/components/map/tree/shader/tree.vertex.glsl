uniform float uTime;

varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    vec3 newPosition = position;
    
    // Calculate wiggle amount based on height using position.z (up axis)
    // The crown mesh is 20 units tall, so we'll start the wiggle at 5 units up
    float heightFactor = smoothstep(-10.0, 20.0, position.z);
    float wiggleAmount = sin(position.x * 0.1 + uTime * 2.0) * heightFactor;
    
    newPosition.y += wiggleAmount;
    vec4 modelPosition = modelMatrix * vec4(newPosition,1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vPosition = position;
    vUv = uv;
}