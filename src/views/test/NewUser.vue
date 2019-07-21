<template>
    <div class="new-user bg-gray">
        <div class="bg-white">
            <h3 class="title">注册DEX用户</h3>
        </div>
        <div class="tab w630 mt_20">
            <div class="tips bg-gray w630">
                <p class="font14"><i></i>请输入用户名、邮箱、手机号</p>
                <p class="font14"><i></i>请认真保存钱包密码，我们无法帮您找回，请务必牢记</p>
            </div>

            <el-form>
                <el-form-item label="用户名" prop="userName">
                    <el-input type="input" v-model="input" aria-placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="userName">
                    <el-input type="input" v-model="input" aria-placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userName">
                    <el-input type="input" v-model="input" show-password="#" aria-placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="userName">
                    <el-button type="danger" >创建用户</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        name: "NewUser",
        data(){
            return {
                input:''
            }
        }
    }
</script>

<style scoped>

</style>