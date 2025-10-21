#include <jni.h>
#include "bugOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::bug::initialize(vm);
}
