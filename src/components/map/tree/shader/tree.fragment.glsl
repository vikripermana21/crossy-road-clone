varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    // Create a smoother gradient based on z position (height)
    // The crown is 20 units tall, so we'll make the transition more gradual
    float gradient = smoothstep(-15.0, 20.0, vPosition.z);
    
    // Mix between two colors based on the gradient
    vec3 color1 = vec3(0.2, 0.4, 0.1); // Dark green
    vec3 color2 = vec3(0.4, 0.8, 0.2); // Light green
    vec3 color = mix(color1, color2, gradient);
    
    gl_FragColor = vec4(color, 1.0);
}