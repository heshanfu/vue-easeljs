import $ from 'jquery';
import _ from 'lodash';
import assert from 'assert';
import EaselCanvas from '../src/components/EaselCanvas.vue';
import EaselContainer from '../src/components/EaselContainer.vue';
import easeljs from '../src/easel.js';
import EaselShape from '../src/components/EaselShape.vue';
import Vue from 'vue';

describe('EaselParent', function () {

    _.forIn({EaselCanvas, EaselContainer}, (Implementor, className) => {

        describe('#' + className, () => {

            var vm = new Vue({
                template: `
                    <implementor ref="parent">
                        <easel-shape 
                            v-if="showOne"
                            ref="one"
                            key="one"
                            x="1"
                            y="2"
                            fill="black"
                            form="circle"
                            dimensions="10"
                        >
                        </easel-shape>
                        <easel-shape 
                            v-if="showTwo"
                            ref="two"
                            key="two"
                            x="1"
                            y="2"
                            fill="black"
                            form="circle"
                            dimensions="10"
                        >
                        </easel-shape>
                    </implementor>
                `,
                components: {
                    'implementor': Implementor,
                    'easel-shape': EaselShape,
                },
                provide() {
                    return {
                        easel: {
                            addChild() {
                            },
                            removeChild() {
                            },
                        },
                    };
                },
                data() {
                    return {
                        showOne: false,
                        showTwo: false,
                    };
                },
            }).$mount();

            var parent = vm.$refs.parent;

            it('should have 0 children', function (done) {
                Vue.nextTick(() => {
                    assert(parent.children, 'parent has no children field');
                    assert(parent.children.length === 0, 'parent has too many children: ' + parent.children.length);
                    done();
                });
            });

            it('should get a child', function (done) {
                vm.showOne = true;
                Vue.nextTick(() => {
                    assert(parent.children.length === 1, 'parent has wrong number of children: ' + parent.children.length);
                    assert(vm.$refs.one === parent.children[0], 'parent has wrong child');
                    done();
                });
            });

            it('should lose a child', function (done) {
                vm.showOne = false;
                Vue.nextTick(() => {
                    assert(parent.children.length === 0, 'parent still has children: ' + parent.children.length);
                    assert(!vm.$refs.one, 'child `one` still exists');
                    done();
                });
            });

            it('should get two children', function (done) {
                vm.showOne = true;
                vm.showTwo = true;
                Vue.nextTick(() => {
                    assert(parent.children.length === 2, 'parent does not have right children' + parent.children.length);
                    assert(vm.$refs.one === parent.children[0], 'child `one` is not in the right place');
                    assert(vm.$refs.two === parent.children[1], 'child `two` is not in the right place');
                    done();
                });
            });

            it('should lose two children', function (done) {
                vm.showOne = false;
                vm.showTwo = false;
                Vue.nextTick(() => {
                    assert(parent.children.length === 0, 'parent still has children: ' + parent.children.length);
                    assert(!vm.$refs.one, 'child `one` still exists');
                    assert(!vm.$refs.two, 'child `two` still exists');
                    done();
                });
            });

            it('should get two children, one by one', function (done) {
                vm.showOne = true;
                var one, two;
                Vue.nextTick()
                    .then(() => {
                        one = vm.$refs.one;
                        vm.showTwo = true;
                        return Vue.nextTick();
                    })
                    .then(() => {
                        two = vm.$refs.two
                        assert(parent.children.length === 2, 'parent does not have right children' + parent.children.length);
                        assert(vm.$refs.one === parent.children[0], 'child `one` is not in the right place');
                        assert(vm.$refs.two === parent.children[1], 'child `two` is not in the right place');
                        assert(one === vm.$refs.one, 'one changed to a new object');
                        done();
                    });
            });

            it('should get the right parent on the child.component', function (done) {
                vm.showOne = true;
                Vue.nextTick()
                    .then(() => {
                        var one = vm.$refs.one;
                        assert(one.component.parent === parent.component);
                        done();
                    });
            });
        });

    });

});
